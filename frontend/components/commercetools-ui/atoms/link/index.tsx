import React, { useMemo } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';
import { resolveReferenceProps, resolveReferenceTarget } from 'helpers/reference';
import { Link as NextLink } from 'i18n/routing';
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
  ...props
}: React.PropsWithChildren<LinkProps>) => {
  const linkUrl = useMemo(() => {
    if (!link) return '';
    if (typeof link === 'string') return link;

    return resolveReferenceTarget(link);
  }, [link]);

  const linkProps = useMemo(() => {
    if (!link || typeof link === 'string') return {};

    return resolveReferenceProps(link);
  }, [link]);

  const linkClassNames = useClassNames([variant ? variantStyle[variant] : '', className]);

  return (
    <NextLink {...props} {...linkProps} href={linkUrl ? linkUrl : '#'} className={linkClassNames} title={title}>
      {children}
    </NextLink>
  );
};

export default Link;
