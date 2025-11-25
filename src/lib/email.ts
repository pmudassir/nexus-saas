import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set - email features will not work');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key');

export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@yoursaas.com';
