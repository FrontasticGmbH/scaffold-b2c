import { useParams } from 'next/navigation';
import { getLocalizationInfo } from 'project.config';

export const useResolvedLocalizedObject = (localized: object | string) => {
  const { locale: nextLocale } = useParams();

  const { locale } = getLocalizationInfo(nextLocale);

  return localized[locale as keyof typeof localized] ?? localized ?? '';
};
