import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Context, Project } from '@frontastic/extension-types';
import { Account } from '@Types/account/Account';
import { Order } from '@Types/cart/Order';
import { SmtpConfig } from '../interfaces/SmtpConfig';
import { SmtpConfigurationError } from '../errors/SmtpConfigurationError';
import getCustomerName from '../utils/get-customer-name';
import { getFromProjectConfig } from '../utils/Context';

export class EmailApi {
  // Email transporter
  transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  locale: string;

  sender: string;

  client_host: string;

  constructor(frontasticContext: Context, locale: string) {
    const smtpConfig = this.getSmtpConfig(frontasticContext);

    this.client_host = smtpConfig.client_host;
    this.sender = smtpConfig.sender;

    this.locale = locale;

    this.transport = nodemailer.createTransport({
      host: smtpConfig.host,
      port: +smtpConfig.port,
      secure: smtpConfig.port == 465,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });
  }

  protected getSmtpConfigValue(key: string, context: Context) {
    let value = getFromProjectConfig(`EXTENSION_SMTP_${key}`, context);

    if (!value) {
      value = context.project.configuration?.smtp?.[key.toLowerCase()];
    }

    if (!value) {
      throw new SmtpConfigurationError({
        message: `The SMTP configuration option "${key}" is missing in project "${context.project.projectId}"`,
      });
    }

    return value;
  }

  protected getSmtpConfig(context: Context): SmtpConfig {
    const smtpConfig: SmtpConfig = {
      host: this.getSmtpConfigValue('HOST', context),
      port: this.getSmtpConfigValue('PORT', context),
      encryption: this.getSmtpConfigValue('ENCRYPTION', context),
      user: this.getSmtpConfigValue('USER', context),
      password: this.getSmtpConfigValue('PASSWORD', context),
      sender: this.getSmtpConfigValue('SENDER', context),
      client_host: this.getSmtpConfigValue('CLIENT_HOST', context),
    };

    return smtpConfig;
  }

  async sendEmail(data: { to: string; subject?: string; text?: string; html?: string }) {
    const from = this.sender;
    const { to, text, html, subject } = data;
    return await this.transport.sendMail({ from, to, subject, text, html });
  }

  async sendAccountVerificationEmail(customer: Account) {
    if (!customer.confirmationToken?.token) {
      console.error('No valid confirmation token');
      return;
    }

    const verificationUrl = `${this.client_host}/verify?token=${customer.confirmationToken.token}`;

    const htmlVerificationMessage = `
      <h1>Thanks for your registration!</h1>
      <p style="margin-top: 10px;color:gray;">Please activate your account by clicking the below link</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await this.sendEmail({
      to: customer.email,
      subject: 'Account Verification',
      html: htmlVerificationMessage,
    });
  }

  async sendPasswordResetEmail(customer: Account, token: string) {
    if (!token) {
      console.error('No valid reset token');
      return;
    }

    const url = `${this.client_host}/reset-password?token=${token}`;

    const htmlResetPasswordMessage = `
      <h1>You requested a password reset!</h1>
      <p style="margin-top: 10px;color:gray;">Please click the link below to proceed.</p>
      <a href="${url}">${url}</a>
    `;

    await this.sendEmail({
      to: customer.email,
      subject: 'Password Reset',
      html: htmlResetPasswordMessage,
    });
  }

  async sendOrderConfirmationEmail(order: Order) {
    const htmlPaymentConfirmationMessage = `
      <h1>Thanks for your order!</h1>
      <p style="margin-top: 10px;color:gray;">Your payment has been confirmed.</p>
    `;

    await this.sendEmail({
      to: order.email,
      subject: 'Order confirmed',
      html: htmlPaymentConfirmationMessage,
    });
  }

  async sendWelcomeCustomerEmail(customer: Account) {
    const customerName = getCustomerName(customer);
    const htmlWelcomeCustomerMessage = `
      <h1>Hello ${customerName}</h1>
      <p>We are so happy to have you here!</p>
    `;
    await this.sendEmail({
      to: customer.email,
      subject: 'Welcome',
      html: htmlWelcomeCustomerMessage,
    });
  }

  async sendAccountDeletionEmail(customer: Account) {
    const customerName = getCustomerName(customer);
    const htmlWelcomeCustomerMessage = `
      <h1>Hello ${customerName}</h1>
      <p>Your account has been deleted successfully!</p>
    `;
    await this.sendEmail({
      to: customer.email,
      subject: 'Account deleted',
      html: htmlWelcomeCustomerMessage,
    });
  }
}
