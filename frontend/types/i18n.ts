export interface Translations {
  [locale: string]: {
    [namespace: string]: {
      [key: string]: string;
    };
  };
}
