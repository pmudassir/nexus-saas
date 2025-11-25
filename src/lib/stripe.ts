import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

export const STRIPE_PRICE_IDS = {
  STARTER: process.env.STRIPE_STARTER_PRICE_ID || '',
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
};
