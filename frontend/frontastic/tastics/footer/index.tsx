'use client';

import React from 'react';
import Footer, { Props as FooterProps } from 'components/commercetools-ui/organisms/footer';
import { FooterLink } from 'components/commercetools-ui/organisms/footer/atoms/column';
import { TasticProps } from '../types';

interface Props extends FooterProps {
  headerCol1: string;
  linksCol1: FooterLink[];
  headerCol2: string;
  linksCol2: FooterLink[];
  headerCol3: string;
  linksCol3: FooterLink[];
  headerCol4: string;
  linksCol4: FooterLink[];
}

const FooterTastic = ({ data }: TasticProps<Props>) => {
  const columns = [
    {
      header: data.headerCol1,
      links: data.linksCol1,
    },
    {
      header: data.headerCol2,
      links: data.linksCol2,
    },
    {
      header: data.headerCol3,
      links: data.linksCol3,
    },
    {
      header: data.headerCol4,
      links: data.linksCol4,
    },
  ];

  return (
    <div className="fixed-screen-width lg:relative-width">
      <Footer {...data} columns={columns} />
    </div>
  );
};

export default FooterTastic;
