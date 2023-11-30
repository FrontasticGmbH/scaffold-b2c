'use client';

import React, { useContext } from 'react';
import { Translations } from 'types/i18n';

export interface I18nContextShape {
  translations: Translations;
}

export const I18nContext = React.createContext({} as I18nContextShape);

const I18nProvider = ({ translations, children }: React.PropsWithChildren<I18nContextShape>) => {
  return <I18nContext.Provider value={{ translations }}>{children}</I18nContext.Provider>;
};

export default I18nProvider;

export const useI18n = () => useContext(I18nContext);
