'use server';

import { redirect } from 'next/navigation';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(formData: FormData) {
  const { tenant, session } = await requireTenantMembership();

  const plan = formData.get('plan') as 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  
  if (!plan || !STRIPE_PLANS[plan]) {
    throw new Error('Invalid plan selected');
  }

  const userId = (session.user as { id: string; email: string }).id;
  const userEmail = (session.user as { id: string; email: string }).email;

  try {
    // Create or retrieve Stripe customer
    let customerId = tenant.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          tenantId: tenant.id,
          userId,
        },
      });
      
      customerId = customer.id;
      
      // Update tenant with customer ID
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PLANS[plan].priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/settings/billing?canceled=true`,
      metadata: {
        tenantId: tenant.id,
        plan,
      },
    });

    redirect(checkoutSession.url!);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create a Stripe portal session for managing subscription
 */
export async function createPortalSession() {
  const { tenant } = await requireTenantMembership();

  if (!tenant.stripeCustomerId) {
    throw new Error('No Stripe customer found');
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/settings/billing`,
    });

    redirect(portalSession.url);
  } catch (error) {
    console.error('Stripe portal error:', error);
    throw new Error('Failed to create portal session');
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription() {
  const { tenant } = await requireTenantMembership();

  const subscription = await prisma.subscription.findFirst({
    where: {
      tenantId: tenant.id,
      status: 'ACTIVE',
    },
  });

  if (!subscription || !subscription.stripeSubscriptionId) {
    throw new Error('No active subscription found');
  }

  try {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
    });
  } catch (error) {
    console.error('Stripe cancellation error:', error);
    throw new Error('Failed to cancel subscription');
  }
}
