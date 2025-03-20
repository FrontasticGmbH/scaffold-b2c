import React, { FC } from 'react';
import { useTranslations } from 'use-intl';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import { SocialMedia } from '.';

interface Props {
  logo?: ImageProps;
  socialMedia?: SocialMedia[];
}

const FooterBottom: FC<Props> = ({ logo, socialMedia }) => {
  const translate = useTranslations();
  return (
    <>
      <div className="hidden items-center justify-between px-24 py-36 md:flex xl:p-48">
        {logo && (
          <div className="w-160">
            <Image {...logo} alt="logo" />
          </div>
        )}
        <p className="text-14 text-neutral-500">{translate('common.powered')}</p>
        <ul className="flex flex-row gap-20 self-center">
          {socialMedia?.map((item, i) => (
            <li key={i} className="w-22">
              <Link link={item.reference} title={item.title}>
                <Image {...item.logo} className="mb-20" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center py-32 md:hidden">
        <ul className="mb-20 flex flex-row gap-20 self-center">
          {socialMedia?.map((item, i) => (
            <li key={i} className="w-22">
              <Link link={item.reference}>
                <Image {...item.logo} className="mb-16" />
              </Link>
            </li>
          ))}
        </ul>
        {logo && (
          <div className="mb-16 w-190">
            <Image {...logo} alt="logo" />
          </div>
        )}
        <p className="text-14 text-neutral-500">{translate('common.powered')}</p>
      </div>
    </>
  );
};

export default FooterBottom;
