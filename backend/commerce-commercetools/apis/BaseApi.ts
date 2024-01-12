import {
  ApiRoot,
  ClientRequest,
  createApiBuilderFromCtpClient,
  ProductType,
  Project,
} from '@commercetools/platform-sdk';
import { ClientFactory } from '../ClientFactory';
import { Context, Request } from '@frontastic/extension-types';
import { getConfig } from '../utils/GetConfig';
import { Locale } from '../Locale';
import { LocaleError } from '../errors/LocaleError';
import { ExternalError } from '../utils/Errors';
import { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';
import { ClientConfig } from '../interfaces/ClientConfig';
import { Token } from '@Types/Token';
import { calculateExpirationTime, tokenHasExpired } from '../utils/Token';
import crypto from 'crypto';
import { Guid } from '@Commerce-commercetools/utils/Guid';
import { Account } from '@Types/account';
import { ValidationError } from '@Commerce-commercetools/errors/ValidationError';

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

const projectCacheTtlMilliseconds = 10 * 60 * 1000;
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
  protected token: Token;
  protected currency: string;
  protected sessionData: any | null;

  constructor(frontasticContext: Context, locale: string | null, currency: string | null, request?: Request | null) {
    this.defaultLocale = frontasticContext.project.defaultLocale;
    this.defaultCurrency = defaultCurrency;

    this.locale = locale !== null ? locale : this.defaultLocale;
    this.currency = currency;

    const engine = 'commercetools';
    this.clientSettings = getConfig(frontasticContext, engine, this.locale);

    this.environment = frontasticContext.environment;
    this.projectKey = this.clientSettings.projectKey;
    this.productIdField = this.clientSettings?.productIdField || 'key';
    this.categoryIdField = this.clientSettings?.categoryIdField || 'key';

    this.token = clientTokensStored.get(this.getClientHashKey());

    this.sessionData = request?.sessionData;
  }

  getSessionData(): any | null {
    return this.sessionData;
  }

  invalidateSessionCheckoutData(): void {
    this.invalidateSessionAnonymousId();
    this.invalidateSessionCheckoutToken();
  }

  invalidateSessionAnonymousId(): void {
    if (this.sessionData?.anonymousId) {
      this.sessionData.anonymousId = undefined;
    }
  }

  invalidateSessionCheckoutToken(): void {
    if (this.sessionData?.checkoutToken) {
      this.sessionData.checkoutToken = undefined;
    }
  }

  setSessionCheckoutToken(token: Token): void {
    this.sessionData.checkoutToken = token;
  }

  getSessionCheckoutToken(): Token | undefined {
    return this.sessionData?.checkoutToken ?? undefined;
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

  private getClientHashKey(): string {
    if (this.clientHashKey) {
      return this.clientHashKey;
    }

    this.clientHashKey = crypto
      .createHash('md5')
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

    this.apiRoot = createApiBuilderFromCtpClient(client);

    return this.apiRoot;
  }

  protected getAnonymousIdFromSessionData(): string {
    if (this.sessionData?.anonymousId) {
      return this.sessionData.anonymousId;
    }

    this.sessionData = {
      ...this.sessionData,
      anonymousId: Guid.newGuid(),
    };

    return this.sessionData.anonymousId;
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

  protected async getProductTypes() {
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
          expiryTime: projectCacheTtlMilliseconds * 1000 + now,
        };

        return productTypes;
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
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
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
    const project = response.body;

    projectCache[this.projectKey] = {
      project,
      expiryTime: projectCacheTtlMilliseconds * 1000 + now,
    };

    return project;
  }

  protected async generateCheckoutToken(anonymousId?: string, account?: Account, refreshToken?: string) {
    if (anonymousId === undefined && account === undefined && refreshToken === undefined) {
      throw new ValidationError({ message: 'Either anonymousId, account, or refresh token must be defined' });
    }

    const scopes = ['manage_my_orders:' + this.clientSettings.projectKey];

    const client = ClientFactory.factorWithoutAuthenticationFlow(this.clientSettings);

    const request: ClientRequest = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${this.clientSettings.clientId}:${this.clientSettings.clientSecret}`,
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    switch (true) {
      case refreshToken !== undefined:
        request.uri = `/oauth/token`;
        request.body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`;
        break;

      case account !== undefined:
        request.uri = `/oauth/${this.clientSettings.projectKey}/customers/token`;
        request.body = `grant_type=password&username=${encodeURIComponent(account.email)}&password=${encodeURIComponent(
          account.password,
        )}&scope=${scopes.join(' ')}`;
        break;

      case anonymousId !== undefined:
        request.uri = `/oauth/${this.clientSettings.projectKey}/anonymous/token`;
        request.body = `grant_type=client_credentials&anonymous_id=${encodeURIComponent(
          anonymousId,
        )}&scope=${scopes.join(' ')}`;
        break;
    }

    await client
      .execute(request)
      .then((response) => {
        const token: Token = {
          token: response.body.access_token,
          expirationTime: calculateExpirationTime(response.body.expires_in),
          refreshToken: response.body.refresh_token ?? refreshToken,
        };
        this.setSessionCheckoutToken(token);
      })
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  }
}
