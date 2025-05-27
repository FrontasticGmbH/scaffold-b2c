// @ts-ignore
import crypto from 'crypto';
// @ts-ignore
import fetch from 'node-fetch';
import { ApiRoot, createApiBuilderFromCtpClient, ProductType, Project } from '@commercetools/platform-sdk';
import { Context, Request } from '@frontastic/extension-types';
import { TokenCache, TokenStore } from '@commercetools/ts-client';
import { Token } from '@Types/Token';
import { ClientFactory } from '../ClientFactory';
import { getConfig } from '../utils/GetConfig';
import { Locale } from '../Locale';
import { LocaleError } from '../errors/LocaleError';
import { ClientConfig } from '../interfaces/ClientConfig';
import { tokenHasExpired } from '../utils/Token';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { ConfigurationError } from '@Commerce-commercetools/errors/ConfigurationError';

const defaultCurrency = 'USD';

const localeRegex =
  /^(?<language>[a-z]{2,})(?:_(?<territory>[A-Z0-9]{2,}))?(?:\.(?<codeset>[A-Z0-9_+-]+))?(?:@(?<modifier>[A-Za-z]+))?$/;

const languageToTerritory = {
  en: 'US',
};

const modifierToCurrency = {
  dollar: 'USD',
  euro: 'EUR',
};

const territoryToCurrency = {
  AD: 'EUR',
  AE: 'AED',
  AF: 'AFN',
  AG: 'XCD',
  AI: 'XCD',
  AL: 'ALL',
  AM: 'AMD',
  AN: 'ANG',
  AO: 'AOA',
  AQ: 'AQD',
  AR: 'ARS',
  AS: 'EUR',
  AT: 'EUR',
  AU: 'AUD',
  AW: 'ANG',
  AX: 'EUR',
  AZ: 'AZN',
  BA: 'BAM',
  BB: 'BBD',
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BR: 'BRL',
  BS: 'BSD',
  BT: 'INR',
  BV: 'NOK',
  BW: 'BWP',
  BY: 'BYR',
  BZ: 'BZD',
  CA: 'CAD',
  CC: 'AUD',
  CD: 'CDF',
  CF: 'XAF',
  CG: 'XAF',
  CH: 'CHF',
  CI: 'XOF',
  CK: 'NZD',
  CL: 'CLP',
  CM: 'XAF',
  CN: 'CNY',
  CO: 'COP',
  CR: 'CRC',
  CU: 'CUP',
  CV: 'CVE',
  CX: 'AUD',
  CY: 'CYP',
  CZ: 'CZK',
  DE: 'EUR',
  DJ: 'DJF',
  DK: 'DKK',
  DM: 'XCD',
  DO: 'DOP',
  DZ: 'DZD',
  EC: 'ECS',
  EE: 'EEK',
  EG: 'EGP',
  EH: 'MAD',
  ER: 'ETB',
  ES: 'EUR',
  ET: 'ETB',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  FR: 'EUR',
  GA: 'XAF',
  GB: 'GBP',
  GD: 'XCD',
  GE: 'GEL',
  GF: 'EUR',
  GG: 'GGP',
  GH: 'GHS',
  GI: 'GIP',
  GL: 'DKK',
  GM: 'GMD',
  GN: 'GNF',
  GP: 'EUR',
  GQ: 'XAF',
  GR: 'EUR',
  GS: 'GBP',
  GT: 'GTQ',
  GU: 'USD',
  GW: 'XOF',
  GY: 'GYD',
  HK: 'HKD',
  HM: 'AUD',
  HN: 'HNL',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  ID: 'IDR',
  IE: 'EUR',
  IL: 'ILS',
  IM: 'GBP',
  IN: 'INR',
  IO: 'USD',
  IQ: 'IQD',
  IR: 'IRR',
  IS: 'ISK',
  IT: 'EUR',
  JE: 'GBP',
  JM: 'JMD',
  JO: 'JOD',
  JP: 'JPY',
  KE: 'KES',
  KG: 'KGS',
  KH: 'KHR',
  KI: 'AUD',
  KM: 'KMF',
  KN: 'XCD',
  KP: 'KPW',
  KR: 'KRW',
  KW: 'KWD',
  KY: 'KYD',
  KZ: 'KZT',
  LA: 'LAK',
  LB: 'LBP',
  LC: 'XCD',
  LI: 'CHF',
  LK: 'LKR',
  LR: 'LRD',
  LS: 'LSL',
  LT: 'LTL',
  LU: 'EUR',
  LV: 'LVL',
  LY: 'LYD',
  MA: 'MAD',
  MC: 'EUR',
  MD: 'MDL',
  ME: 'EUR',
  MF: 'ANG',
  MG: 'MGA',
  MH: 'USD',
  MK: 'MKD',
  ML: 'XOF',
  MM: 'MMK',
  MN: 'MNT',
  MO: 'MOP',
  MP: 'USD',
  MQ: 'EUR',
  MR: 'MRO',
  MS: 'XCD',
  MT: 'MTL',
  MU: 'MUR',
  MV: 'MVR',
  MW: 'MWK',
  MX: 'MXN',
  MY: 'MYR',
  MZ: 'MZN',
  NA: 'NAD',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  NZ: 'NZD',
  OM: 'OMR',
  PA: 'PAB',
  PE: 'PEN',
  PF: 'XPF',
  PG: 'PGK',
  PH: 'PHP',
  PK: 'PKR',
  PL: 'PLN',
  PM: 'EUR',
  PN: 'NZD',
  PR: 'USD',
  PS: 'JOD',
  PT: 'EUR',
  PW: 'USD',
  PY: 'PYG',
  QA: 'QAR',
  RE: 'EUR',
  RO: 'RON',
  RS: 'RSD',
  RU: 'RUB',
  RW: 'RWF',
  SA: 'SAR',
  SB: 'SBD',
  SC: 'SCR',
  SD: 'SDG',
  SE: 'SEK',
  SG: 'SGD',
  SH: 'GBP',
  SI: 'EUR',
  SJ: 'NOK',
  SK: 'SKK',
  SL: 'SLL',
  SM: 'EUR',
  SN: 'XOF',
  SO: 'SOS',
  SR: 'SRD',
  ST: 'STD',
  SV: 'SVC',
  SY: 'SYP',
  SZ: 'SZL',
  TC: 'USD',
  TD: 'XAF',
  TF: 'EUR',
  TG: 'XOF',
  TH: 'THB',
  TJ: 'TJS',
  TK: 'NZD',
  TM: 'TMT',
  TN: 'TND',
  TO: 'TOP',
  TP: 'IDR',
  TR: 'TRY',
  TT: 'TTD',
  TV: 'AUD',
  TW: 'TWD',
  TZ: 'TZS',
  UA: 'UAH',
  UG: 'UGX',
  UM: 'USD',
  USAF: 'USD',
  US: 'USD',
  UY: 'UYU',
  UZ: 'UZS',
  VA: 'EUR',
  VC: 'XCD',
  VE: 'VEF',
  VG: 'USD',
  VI: 'USD',
  VN: 'VND',
  VU: 'VUV',
  WF: 'XPF',
  WS: 'EUR',
  YE: 'YER',
  YT: 'EUR',
  ZA: 'ZAR',
  ZM: 'ZMK',
  ZW: 'ZWD',
};

interface ParsedLocale {
  language: string;
  territory: string;
  currency: string;
}

const parseLocale = (locale: string, currency?: string): ParsedLocale => {
  const matches = locale.match(localeRegex);

  if (matches === null) {
    throw new LocaleError({ message: `Invalid locale: ${locale}` });
  }

  const language = matches.groups.language;

  let territory = matches.groups.territory;
  if (territory === undefined) {
    if (language in languageToTerritory) {
      territory = languageToTerritory[language];
    } else {
      territory = language.toUpperCase();
    }
  }

  if (!currency) {
    currency = defaultCurrency;

    if (territory in territoryToCurrency) {
      currency = territoryToCurrency[territory];
    }

    const modifier = matches.groups.modifier;
    if (modifier !== undefined) {
      if (modifier in modifierToCurrency) {
        currency = modifierToCurrency[modifier];
      } else {
        const foundCurrency = Object.values(territoryToCurrency).find(
          (currency) => currency === modifier.toUpperCase(),
        );
        if (foundCurrency !== undefined) {
          currency = foundCurrency;
        }
      }
    }
  }

  return {
    language,
    territory,
    currency,
  };
};

const cacheTtlMilliseconds = 60 * 1000;
const projectCache: {
  [projectKey: string]: { project: Project; expiryTime: number };
} = {};

const productTypesCache: {
  [projectKey: string]: { productTypes: ProductType[]; expiryTime: number };
} = {};

const pickCandidate = (candidates: string[], availableOptions: string[]): string | undefined => {
  for (const candidate of candidates) {
    const found = availableOptions.find((option) => option.toLowerCase() === candidate.toLowerCase());
    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
};

const pickCommercetoolsLanguage = (parsedLocale: ParsedLocale, availableLanguages: string[]): string | undefined => {
  const candidates = [`${parsedLocale.language}-${parsedLocale.territory}`, parsedLocale.language];

  const foundCandidate = pickCandidate(candidates, availableLanguages);
  if (foundCandidate !== undefined) {
    return foundCandidate;
  }

  const prefix = `${parsedLocale.language.toLowerCase()}-`;
  const foundPrefix = availableLanguages.find((option) => option.toLowerCase().startsWith(prefix));
  if (foundPrefix !== undefined) {
    return foundPrefix;
  }

  return undefined;
};

const pickCommercetoolsCountry = (
  parsedLocale: ParsedLocale,
  language: string,
  availableCountries: string[],
): string | undefined => {
  const candidates = [parsedLocale.territory, parsedLocale.language, language];

  const foundCandidate = pickCandidate(candidates, availableCountries);
  if (foundCandidate !== undefined) {
    return foundCandidate;
  }

  return undefined;
};

const pickCommercetoolsCurrency = (parsedLocale: ParsedLocale, availableCurrencies: string[]): string | undefined => {
  const candidates = [
    parsedLocale.currency,
    parseLocale(`${parsedLocale.language}_${parsedLocale.territory}`).currency,
  ];

  const foundCandidate = pickCandidate(candidates, availableCurrencies);
  if (foundCandidate !== undefined) {
    return foundCandidate;
  }

  return undefined;
};

const clientTokensStored = new Map<string, Token>();

export abstract class BaseApi {
  protected apiRoot: ApiRoot;
  protected clientSettings: ClientConfig;
  protected environment: string;
  protected projectKey: string;
  protected productIdField: string;
  protected categoryIdField: string;
  protected locale: string;
  protected defaultLocale: string;
  protected defaultCurrency: string;
  protected clientHashKey: string;
  protected checkoutHashKey: string;
  protected token: Token;
  protected currency: string;
  protected sessionData: any | null;

  constructor(
    commercetoolsFrontendContext: Context,
    locale: string | null,
    currency: string | null,
    request?: Request | null,
  ) {
    this.defaultLocale = commercetoolsFrontendContext.project.defaultLocale;
    this.defaultCurrency = defaultCurrency;

    this.locale = locale !== null ? locale : this.defaultLocale;
    this.currency = currency;

    const engine = 'commercetools';
    this.clientSettings = getConfig(commercetoolsFrontendContext, engine, this.locale);

    this.environment = commercetoolsFrontendContext.environment;
    this.projectKey = this.clientSettings.projectKey;
    this.productIdField = this.clientSettings?.productIdField || 'key';
    this.categoryIdField = this.clientSettings?.categoryIdField || 'key';

    this.token = clientTokensStored.get(this.getClientHashKey());

    this.sessionData = request?.sessionData ?? {};
  }

  getSessionData(): any | null {
    return this.sessionData;
  }

  invalidateSessionCheckoutData(): void {
    this.invalidateSessionCheckoutSessionToken();
  }

  invalidateSessionCheckoutSessionToken(): void {
    if (this.sessionData?.checkoutSessionToken) {
      this.sessionData.checkoutSessionToken = undefined;
    }
  }

  async setSessionCheckoutSessionToken(cartId: string, token: Token): Promise<void> {
    const checkoutHashKey = await this.getCheckoutHashKey(cartId);

    if (!this.sessionData) {
      this.sessionData = {};
    }

    this.sessionData.checkoutSessionToken = {};
    this.sessionData.checkoutSessionToken[checkoutHashKey] = token;
  }

  async getSessionCheckoutSessionToken(cartId: string): Promise<Token | undefined> {
    const checkoutHashKey = await this.getCheckoutHashKey(cartId);
    return this.sessionData?.checkoutSessionToken?.[checkoutHashKey] ?? undefined;
  }

  protected requestBuilder() {
    return this.getApiRoot().withProjectKey({ projectKey: this.projectKey });
  }

  protected async getCommercetoolsLocal(): Promise<Locale> {
    const parsedLocale = parseLocale(this.locale, this.currency);
    const parsedDefaultLocale = parseLocale(this.defaultLocale, this.currency);

    const project = await this.getProject();

    /**
     * Get a valid locale following the priority of:
     *
     * 1. From requested locale
     * 2. From default locale
     * 3. First from the list of available ones
     */
    const language =
      pickCommercetoolsLanguage(parsedLocale, project.languages) ??
      pickCommercetoolsLanguage(parsedDefaultLocale, project.languages) ??
      project.languages[0];
    const country =
      pickCommercetoolsCountry(parsedLocale, language, project.countries) ??
      pickCommercetoolsCountry(parsedDefaultLocale, language, project.countries) ??
      project.countries[0];
    const currency =
      pickCommercetoolsCurrency(parsedLocale, project.currencies) ??
      pickCommercetoolsCurrency(parsedDefaultLocale, project.currencies) ??
      project.currencies[0];
    return Promise.resolve({
      language,
      country,
      currency,
    });
  }

  protected async getCommercetoolsProductTypes(): Promise<ProductType[]> {
    const now = Date.now();

    if (this.projectKey in productTypesCache) {
      const cacheEntry = productTypesCache[this.projectKey];

      if (now < cacheEntry.expiryTime) {
        return cacheEntry.productTypes;
      }
    }

    return await this.requestBuilder()
      .productTypes()
      .get()
      .execute()
      .then((response) => {
        const productTypes = response.body.results;

        productTypesCache[this.projectKey] = {
          productTypes,
          expiryTime: cacheTtlMilliseconds + now,
        };

        return productTypes;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  protected async getProject() {
    const now = Date.now();

    if (this.projectKey in projectCache) {
      const cacheEntry = projectCache[this.projectKey];

      if (now < cacheEntry.expiryTime) {
        return cacheEntry.project;
      }
    }

    const response = await this.requestBuilder()
      .get()
      .execute()
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
    const project = response.body;

    projectCache[this.projectKey] = {
      project,
      expiryTime: cacheTtlMilliseconds + now,
    };

    return project;
  }

  protected async generateCheckoutSessionToken(cartId: string) {
    const checkoutSessionToken = await this.getSessionCheckoutSessionToken(cartId);

    if (!tokenHasExpired(checkoutSessionToken)) {
      // The token exist and is not expired, so we don't need to generate a new one.
      return checkoutSessionToken;
    }

    if (checkoutSessionToken) {
      try {
        return await this.refreshCheckoutSessionToken(cartId, checkoutSessionToken);
      } catch (error) {
        // We are ignoring the error refreshing the token and trying to generate a new one
      }
    }

    if (!this.clientSettings.checkoutApplicationKey || !this.clientSettings.sessionUrl) {
      throw new ConfigurationError({
        message:
          'Missing required configuration for checkout session token generation. Please configure the checkout application key and session URL',
      });
    }

    const url = `${this.clientSettings.sessionUrl}/${this.projectKey}/sessions`;

    const date = new Date();
    const orderNumber = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${String(Date.now()).slice(-6, -1)}`;

    const body = JSON.stringify({
      cart: {
        cartRef: {
          id: cartId,
        },
      },
      metadata: {
        applicationKey: this.clientSettings.checkoutApplicationKey,
        futureOrderNumber: orderNumber,
      },
    });

    return await this.fetchCheckoutSessionToken(cartId, url, body);
  }

  private async refreshCheckoutSessionToken(cartId: string, checkoutSessionToken: Token) {
    const url = `${this.clientSettings.sessionUrl}/${this.projectKey}/sessions/${checkoutSessionToken.token}`;

    const body = JSON.stringify({
      actions: [
        {
          action: 'refresh',
        },
      ],
    });

    return await this.fetchCheckoutSessionToken(cartId, url, body);
  }

  private async fetchCheckoutSessionToken(cartId: string, url: string, body: string) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token.token}`,
    };

    const requestOptions = {
      method: 'POST',
      headers,
      body,
    };

    const response = await fetch(url, requestOptions)
      .then((response: any) => {
        return response.json();
      })
      .catch((error: any) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error });
      });

    if (response?.errors) {
      throw new ExternalError({
        statusCode: response?.statusCode,
        message: response.errors[0].message,
        body: response,
        errors: response?.errors,
      });
    }

    const token: Token = {
      token: response?.id,
      expirationTime: response?.expiryAt ? new Date(response?.expiryAt).getTime() : undefined,
    };

    await this.setSessionCheckoutSessionToken(cartId, token);

    return token;
  }

  private commercetoolsTokenCache(): TokenCache {
    return (() => {
      const get = () => {
        if (this.token === undefined) {
          return undefined;
        }

        const tokenStore: TokenStore = {
          token: this.token.token,
          expirationTime: this.token.expirationTime,
          refreshToken: this.token.refreshToken,
        };

        return tokenStore;
      };

      const set = (tokenStore: TokenStore) => {
        this.token = {
          token: tokenStore.token,
          expirationTime: tokenStore.expirationTime,
          refreshToken: tokenStore.refreshToken,
        };
        clientTokensStored.set(this.getClientHashKey(), this.token);
      };

      return { get, set };
    })();
  }

  private async getCheckoutHashKey(cartId: string): Promise<string> {
    if (this.checkoutHashKey) {
      return this.checkoutHashKey;
    }

    this.checkoutHashKey = crypto
      .createHash('sha256')
      .update(this.clientSettings.checkoutApplicationKey + cartId)
      .digest('hex');

    return this.checkoutHashKey;
  }

  private getClientHashKey(): string {
    if (this.clientHashKey) {
      return this.clientHashKey;
    }

    this.clientHashKey = crypto
      .createHash('sha256')
      .update(this.clientSettings.clientId + this.clientSettings.clientSecret + this.clientSettings.projectKey)
      .digest('hex');

    return this.clientHashKey;
  }

  private getApiRoot(): ApiRoot {
    let refreshToken: string | undefined;
    if (this.apiRoot && tokenHasExpired(this.token)) {
      this.apiRoot = undefined;
      refreshToken = this.token?.refreshToken;
    }

    if (this.apiRoot) {
      return this.apiRoot;
    }

    const client = ClientFactory.factor(
      this.clientSettings,
      this.environment,
      this.commercetoolsTokenCache(),
      refreshToken,
    );

    this.apiRoot = createApiBuilderFromCtpClient(client, this.clientSettings.hostUrl);

    return this.apiRoot;
  }
}
