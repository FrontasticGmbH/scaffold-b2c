import React, { useMemo } from 'react';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import useClassNames from 'helpers/hooks/useClassNames';
import { resolveReferenceProps, resolveReferenceTarget } from 'helpers/reference';
import { i18nConfig } from 'project.config';
import { Reference } from 'types/reference';

export type LinkVariant = 'primary' | 'menu-header' | 'menu-item' | 'breadcrumb';

export interface LinkProps extends Omit<React.ComponentProps<typeof NextLink>, 'href' | 'key'> {
  link?: string | Reference;
  variant?: LinkVariant;
}

type VariantStyle = { [key in LinkVariant]: string };

const variantStyle: VariantStyle = {
  primary: 'text-14 lg:text-16 cursor-pointer text-neutral-500 hover:text-neutral-400',
  'menu-item': 'text-gray-600 hover:underline hover:underline-offset-2',
  breadcrumb: 'text-14 font-medium text-primary',
  'menu-header': 'text-14 font-medium text-primary cursor-pointer',
};

const Link = ({
  link,
  children,
  className = '',
  variant,
  title = '',
  locale: localeProp,
  ...props
}: React.PropsWithChildren<LinkProps>) => {
  const { locale } = useParams();

  const linkUrl = useMemo(() => {
    if (!link) return '';
    if (typeof link === 'string') return link;

    return resolveReferenceTarget(link);
  }, [link]);

  const linkMissingLocale =
    linkUrl && linkUrl.startsWith('/') && i18nConfig.locales.every((locale) => !linkUrl.startsWith(`/${locale}/`));

  const linkProps = useMemo(() => {
    if (!link || typeof link === 'string') return {};

    return resolveReferenceProps(link);
  }, [link]);

  const linkClassNames = useClassNames([variant ? variantStyle[variant] : '', className]);

  return (
    <NextLink
      {...props}
      {...linkProps}
      href={linkUrl ? (linkMissingLocale ? `/${localeProp ?? locale}${linkUrl}` : linkUrl) : '#'}
      className={linkClassNames}
      title={title}
    >
      {children}
    </NextLink>
  );
};

export default Link;
