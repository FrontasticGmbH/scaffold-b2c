import { Context } from '@frontastic/extension-types';
import { EmailApi as SendgridEmailApi } from '../../email-sendgrid/apis/EmailApi';
import { EmailApi as SmtpEmailApi } from '../../email-smtp/apis/EmailApi';

export class EmailApiFactory {
  static getSmtpApi(context: Context, locale: string) {
    return new SmtpEmailApi(context, locale);
  }

  static getSendgridApi(context: Context, locale: string) {
    return new SendgridEmailApi(context, locale);
  }

  static getDefaultApi(context: Context, locale: string) {
    return this.getSmtpApi(context, locale);
  }
}
