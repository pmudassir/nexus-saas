import { Shell } from '@/components/layout/Shell';
import { prisma } from '@/lib/prisma';
import { requireTenantMembership } from '@/lib/tenant-auth';
import { Button } from '@/components/ui/button';
import { createCheckoutSession, createPortalSession } from '@/actions/billing';
import { CreditCard, Check, ExternalLink } from 'lucide-react';

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 29,
    features: [
      'Up to 5 team members',
      'Basic website builder',
      '10 GB storage',
      'Email support',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: 79,
    features: [
      'Up to 20 team members',
      'Advanced website builder',
      '100 GB storage',
      'Priority support',
      'Custom branding',
      'Advanced analytics',
    ],
    popular: true,
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited team members',
      'Full website builder',
      'Unlimited storage',
      '24/7 support',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
    ],
  },
];

export default async function BillingPage() {
  const { tenant } = await requireTenantMembership();

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      tenantId: tenant.id,
      status: 'ACTIVE',
    },
    include: {
      plan: true,
    },
  });

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing information.
          </p>
        </div>

        {/* Current Subscription */}
        {activeSubscription && (
          <div className="rounded-md border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Current Plan: {activeSubscription.plan.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeSubscription.currentPeriodEnd 
                    ? `Renews on ${new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}`
                    : 'Active subscription'
                  }
                </p>
              </div>
              <form action={createPortalSession}>
                <Button type="submit" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {activeSubscription ? 'Upgrade Your Plan' : 'Choose Your Plan'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-md border p-6 relative ${
                  plan.popular
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <form action={createCheckoutSession}>
                  <input type="hidden" name="plan" value={plan.id} />
                  <Button
                    type="submit"
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {activeSubscription ? 'Switch Plan' : 'Get Started'}
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Info */}
        <div className="rounded-md border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Billing Information
          </h2>
          <div className="text-sm text-muted-foreground">
            <p>
              All payments are processed securely through Stripe. Your payment
              information is never stored on our servers.
            </p>
            <p className="mt-2">
              Subscriptions automatically renew each month. You can cancel anytime
              from the billing portal.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
