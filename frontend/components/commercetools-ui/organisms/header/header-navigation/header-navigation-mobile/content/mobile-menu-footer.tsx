import React, { FC, useContext, useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import MarketButtonMobile from 'components/commercetools-ui/organisms/market-button/market-button-mobile';
import { AccountContext } from 'context/account';
import { useRouter } from 'i18n/routing';
import { Category } from 'types/entity/category';
import MobileMenuNavButton from '../atoms/menu-nav-button';

export interface Props {
  showMenu: boolean;
  insertCategory: (category: Category) => void;
  hideHeaderMenu: () => void;
}

const MobileMenuFooter: FC<Props> = ({ showMenu, hideHeaderMenu, insertCategory }) => {
  const router = useRouter();
  const translate = useTranslations();
  const marketButtonRef = useRef<HTMLDivElement>(null);
  const { account, logout } = useContext(AccountContext);
  const [languageMenuTop, setLanguageMenuTop] = useState(false);

  const tabs = [
    { name: translate('account.my-account'), href: '/account' },
    { name: translate('account.orders'), href: '/account/?hash=orders' },
    {
      name: translate('account.customer-support'),
      href: '/account/?hash=support',
    },
  ];

  const accountButton: Category = {
    categoryId: 'myAccount',
    name: translate('account.my-account'),
    depth: 1,
    descendants: tabs.map((tab) => {
      return { categoryId: tab.href, name: tab.name, slug: tab.href, descendants: [], depth: 1, _urls: {} };
    }),
    _urls: {},
  };

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
    hideHeaderMenu();
  };

  useLayoutEffect(() => {
    if (marketButtonRef.current) {
      if (window.innerHeight - marketButtonRef.current.getBoundingClientRect().bottom < 100) setLanguageMenuTop(true);
      else setLanguageMenuTop(false);
    }
  }, [showMenu]);

  return (
    <>
      <div className="mb-16 mt-12 w-full border border-neutral-400" />

      {account ? (
        <div className="ml-24 mr-22 block pt-16 md:hidden">
          <MobileMenuNavButton
            link={accountButton}
            onClick={() => insertCategory(accountButton)}
            hideHeaderMenu={hideHeaderMenu}
          />
        </div>
      ) : (
        <div className="ml-24 mr-22 block py-16 md:hidden">
          <Link link="/help" onClick={hideHeaderMenu} className="py-16">
            <p className="text-14 text-primary">{translate('common.help-and-support')}</p>
          </Link>{' '}
        </div>
      )}

      <div className="mx-24 flex py-16">
        {account ? (
          <Button variant="ghost" size="fit" onClick={handleLogout}>
            <span className="font-normal text-primary">{translate('account.sign-out')}</span>
          </Button>
        ) : (
          <Link link="/login" onClick={hideHeaderMenu} className="px-0">
            <span className="text-14 font-normal text-primary">{translate('account.sign-in')}</span>
          </Link>
        )}
      </div>
      <div className="p-16" ref={marketButtonRef}>
        <MarketButtonMobile menuTop={languageMenuTop} />
      </div>
    </>
  );
};

export default MobileMenuFooter;
