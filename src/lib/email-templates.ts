/**
 * Email Templates for Nexus SaaS
 * These templates use inline styles for email client compatibility
 */

interface EmailStyles {
  container: string;
  header: string;
  content: string;
  button: string;
  footer: string;
}

const styles: EmailStyles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    background-color: #f9fafb;
  `,
  header: `
    text-align: center;
    margin-bottom: 32px;
  `,
  content: `
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  `,
  button: `
    display: inline-block;
    background: #000;
    color: #fff;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 16px 0;
  `,
  footer: `
    text-align: center;
    margin-top: 32px;
    color: #6b7280;
    font-size: 14px;
  `,
};

export interface InvitationEmailProps {
  inviteeName: string;
  tenantName: string;
  inviterName: string;
  tempPassword: string;
  loginUrl: string;
}

export function invitationEmail({
  inviteeName,
  tenantName,
  inviterName,
  tempPassword,
  loginUrl,
}: InvitationEmailProps): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <h1 style="font-size: 24px; font-weight: bold; color: #111; margin: 0;">
          Nexus SaaS
        </h1>
      </div>
      <div style="${styles.content}">
        <h2 style="font-size: 20px; color: #111; margin: 0 0 16px;">
          You've been invited! 🎉
        </h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
          Hello ${inviteeName || "there"},
        </p>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
          ${inviterName} has invited you to join <strong>${tenantName}</strong> on Nexus SaaS.
        </p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px; text-transform: uppercase;">
            Your temporary password
          </p>
          <p style="font-family: monospace; font-size: 18px; font-weight: bold; color: #111; margin: 0;">
            ${tempPassword}
          </p>
        </div>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
          Please log in and change your password immediately for security.
        </p>
        <div style="text-align: center;">
          <a href="${loginUrl}" style="${styles.button}">
            Log In to Nexus
          </a>
        </div>
      </div>
      <div style="${styles.footer}">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Nexus SaaS. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

export interface WelcomeEmailProps {
  userName: string;
  tenantName: string;
  dashboardUrl: string;
}

export function welcomeEmail({ userName, tenantName, dashboardUrl }: WelcomeEmailProps): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <h1 style="font-size: 24px; font-weight: bold; color: #111; margin: 0;">
          Nexus SaaS
        </h1>
      </div>
      <div style="${styles.content}">
        <h2 style="font-size: 20px; color: #111; margin: 0 0 16px;">
          Welcome to ${tenantName}! 👋
        </h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
          Your account has been set up and you're ready to start using Nexus SaaS. 
          Here's what you can do:
        </p>
        <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px; margin: 0 0 24px;">
          <li>Manage projects and tasks</li>
          <li>Track leads and contacts in CRM</li>
          <li>Handle invoices and expenses</li>
          <li>Build landing pages with Website Builder</li>
        </ul>
        <div style="text-align: center;">
          <a href="${dashboardUrl}" style="${styles.button}">
            Go to Dashboard
          </a>
        </div>
      </div>
      <div style="${styles.footer}">
        <p style="margin: 0;">
          Need help? Reply to this email or visit our documentation.
        </p>
      </div>
    </div>
  `;
}

export interface SubscriptionReceiptProps {
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  periodEnd: string;
  invoiceUrl?: string;
}

export function subscriptionReceiptEmail({
  userName,
  planName,
  amount,
  currency,
  periodEnd,
  invoiceUrl,
}: SubscriptionReceiptProps): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <h1 style="font-size: 24px; font-weight: bold; color: #111; margin: 0;">
          Nexus SaaS
        </h1>
      </div>
      <div style="${styles.content}">
        <h2 style="font-size: 20px; color: #111; margin: 0 0 16px;">
          Payment Receipt 🧾
        </h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
          Hi ${userName}, thank you for your payment!
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 0 0 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #6b7280;">Plan</span>
            <span style="color: #111; font-weight: 600;">${planName}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #6b7280;">Amount</span>
            <span style="color: #111; font-weight: 600;">${currency.toUpperCase()} ${amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">Next billing date</span>
            <span style="color: #111; font-weight: 600;">${periodEnd}</span>
          </div>
        </div>
        ${invoiceUrl ? `
          <div style="text-align: center;">
            <a href="${invoiceUrl}" style="${styles.button}">
              View Invoice
            </a>
          </div>
        ` : ""}
      </div>
      <div style="${styles.footer}">
        <p style="margin: 0;">
          Questions about your billing? Contact support@nexus-saas.com
        </p>
      </div>
    </div>
  `;
}

export interface PasswordResetProps {
  userName: string;
  resetUrl: string;
  expiresIn: string;
}

export function passwordResetEmail({ userName, resetUrl, expiresIn }: PasswordResetProps): string {
  return `
    <div style="${styles.container}">
      <div style="${styles.header}">
        <h1 style="font-size: 24px; font-weight: bold; color: #111; margin: 0;">
          Nexus SaaS
        </h1>
      </div>
      <div style="${styles.content}">
        <h2 style="font-size: 20px; color: #111; margin: 0 0 16px;">
          Reset Your Password 🔐
        </h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px;">
          We received a request to reset your password. Click the button below to create a new password.
          This link will expire in ${expiresIn}.
        </p>
        <div style="text-align: center;">
          <a href="${resetUrl}" style="${styles.button}">
            Reset Password
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
      <div style="${styles.footer}">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Nexus SaaS. All rights reserved.
        </p>
      </div>
    </div>
  `;
}
