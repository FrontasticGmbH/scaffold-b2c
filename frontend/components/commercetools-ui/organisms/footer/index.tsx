import React from 'react';
import Accordion from 'components/commercetools-ui/atoms/accordion';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Reference } from 'types/reference';
import Column, { FooterLink } from './atoms/column';
import FooterBottom from './footer-bottom';

export interface FooterColumn {
  header?: string;
  links?: FooterLink[];
}
export interface Props {
  columns: FooterColumn[];
  logo?: ImageProps;
  socialMedia?: SocialMedia[];
}

export interface SocialMedia {
  title: string;
  logo: ImageProps;
  reference: Reference;
}

const Footer: React.FC<Props> = ({ columns, logo, socialMedia }) => {
  return (
    <footer aria-labelledby="footer-heading" className="w-full bg-primary">
      <div className="hidden w-full justify-between px-24 py-58 md:flex lg:px-20 xl:px-48">
        <div className="grid w-full grid-cols-4">
          {columns?.map((column, index) => (
            <div key={index}>
              <Column
                header={column.header}
                links={column.links ?? []}
                className="flex flex-col items-center lg:items-start"
              />
            </div>
          ))}
        </div>
      </div>

      <ul className="flex flex-col md:hidden">
        {columns?.map((column, index) => (
          <li key={index} className="border-b border-neutral-300">
            <Accordion
              variant="arrow"
              closedSectionTitle={column.header ?? ''}
              openSectionTitle={column.header}
              buttonClassName="h-48 text-14 font-medium text-white px-12 text-neutral-150"
              iconClassName="text-neutral"
            >
              <div className="mb-16 ml-20 flex flex-row text-14 md:ml-24" key={index}>
                <Column links={column.links ?? []} className="px-0" />
              </div>
            </Accordion>
          </li>
        ))}
      </ul>
      <div className="w-full sm:border-t-accent" />
      <FooterBottom socialMedia={socialMedia} logo={logo} />
    </footer>
  );
};

export default Footer;
