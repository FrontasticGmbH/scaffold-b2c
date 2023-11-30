import { Context } from '@frontastic/extension-types';
import SendgridClient from '@sendgrid/mail';
import { Account } from '@Types/account/Account';
import { Order } from '@Types/cart/Order';
import { formatPrice } from '../utils/Price';
import { getFromProjectConfig } from '../utils/Context';

export class EmailApi {
  client: typeof SendgridClient;

  locale?: string;

  configuration: {
    sender: string;
    clientHost: string;
    templateIds: Record<string, string>;
  };

  constructor(frontasticContext: Context, locale?: string) {
    this.client = SendgridClient;
    let apiKey = getFromProjectConfig('EXTENSION_SENDGRID_API_KEY', frontasticContext);
    if (!apiKey) {
      apiKey = frontasticContext.project.configuration?.sendgrid?.apiKey;
    }

    this.client.setApiKey(apiKey);

    this.locale = locale;

    this.configuration = {
      sender: getFromProjectConfig('EXTENSION_SENDGRID_SENDER', frontasticContext),
      clientHost: getFromProjectConfig('EXTENSION_SENDGRID_CLIENT_HOST', frontasticContext),
      templateIds: getFromProjectConfig('EXTENSION_SENDGRID_TEMPLATE_IDS', frontasticContext),
    };

    if (!this.configuration.sender) {
      this.configuration.sender = frontasticContext.project.configuration?.sendgrid?.sender;
    }

    if (!this.configuration.clientHost) {
      this.configuration.clientHost = frontasticContext.project.configuration?.sendgrid?.clientHost;
    }

    if (!this.configuration.templateIds) {
      this.configuration.templateIds = frontasticContext.project.configuration?.sendgrid?.templateIds;
    }
  }

  async sendAccountVerificationEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: {
            customer,
            url: `${this.configuration.clientHost}/verify?token=${customer.confirmationToken.token}`,
          },
        },
      ],
      templateId: this.configuration.templateIds.accountVerification,
    });
  }

  async sendPasswordResetEmail(customer: Account, token: string) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: {
            customer,
            url: `${this.configuration.clientHost}/reset-password?token=${token}`,
          },
        },
      ],
      templateId: this.configuration.templateIds.passwordReset,
    });
  }

  async sendOrderConfirmationEmail(order: Order) {
    const locale = this.locale?.replace('_', '-');

    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [order.email],
          dynamicTemplateData: {
            order: {
              ...order,
              formattedTotalPrice: formatPrice(order.sum, locale),
              lineItems: order.lineItems.map((lineItem) => ({
                ...lineItem,
                formattedPrice: formatPrice(lineItem.totalPrice, locale),
                imageUrl: lineItem.variant.images[0],
              })),
              shippingInfo: {
                ...order.shippingInfo,
                formattedPrice: formatPrice(order.shippingInfo?.price, locale),
              },
            },
          },
        },
      ],
      templateId: this.configuration.templateIds.orderConfirmation,
    });
  }

  async sendWelcomeCustomerEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: { customer },
        },
      ],
      templateId: this.configuration.templateIds.welcomeCustomer,
    });
  }

  async sendAccountDeletionEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: { customer },
        },
      ],
      templateId: this.configuration.templateIds.accountDeletion,
    });
  }
}
