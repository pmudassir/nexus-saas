import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const tenantId = session.metadata?.tenantId;
  if (!tenantId) return;

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  // First, try to find existing subscription
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (existingSubscription) {
    // Update existing
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });
  } else {
    // Create new - find or create plan first
    let plan = await prisma.plan.findFirst({
      where: { name: session.metadata?.plan || 'Starter' },
    });

    if (!plan) {
      // Create default plan if it doesn't exist
      plan = await prisma.plan.create({
        data: {
          name: session.metadata?.plan || 'Starter',
          description: 'Default plan',
          priceMonthly: 0,
        },
      });
    }

    await prisma.subscription.create({
      data: {
        tenantId,
        planId: plan.id,
        status: 'ACTIVE',
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });
  }

  // Log the event
  await prisma.auditLog.create({
    data: {
      tenantId,
      action: 'SUBSCRIPTION_CREATED',
      entity: 'Subscription',
      entityId: subscription.id,
      metadata: { plan: session.metadata?.plan },
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const existing = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const existing = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        status: 'CANCELED',
      },
    });
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Log successful payment
  const subscriptionId = typeof (invoice as any).subscription === 'string' 
    ? (invoice as any).subscription 
    : (invoice as any).subscription?.id;
    
  if (subscriptionId) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
    });

    if (subscription) {
      await prisma.auditLog.create({
        data: {
          tenantId: subscription.tenantId,
          action: 'PAYMENT_SUCCEEDED',
          entity: 'Invoice',
          entityId: invoice.id,
          metadata: {
            amount: invoice.amount_paid / 100,
            currency: invoice.currency,
          },
        },
      });
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Log failed payment
  const subscriptionId = typeof (invoice as any).subscription === 'string' 
    ? (invoice as any).subscription 
    : (invoice as any).subscription?.id;
    
  if (subscriptionId) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscriptionId,
      },
    });

    if (subscription) {
      await prisma.auditLog.create({
        data: {
          tenantId: subscription.tenantId,
          action: 'PAYMENT_FAILED',
          entity: 'Invoice',
          entityId: invoice.id,
          metadata: {
            amount: invoice.amount_due / 100,
            currency: invoice.currency,
          },
        },
      });
    }
  }
}
