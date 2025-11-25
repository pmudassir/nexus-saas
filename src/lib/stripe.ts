import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-11-17.clover',
});

export const STRIPE_PRICE_IDS = {
  STARTER: process.env.STRIPE_STARTER_PRICE_ID || '',
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
};
