import React from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Reference } from 'types/reference';

export interface FooterLink {
  name: string;
  reference: Reference;
}

export interface Props {
  header?: string;
  links: FooterLink[];
  className?: string;
}

const Column: React.FC<Props> = ({ header, links, className }) => {
  return (
    <div className={className}>
      {header && <Typography className="self-start font-medium text-neutral-200 sm:pb-20">{header}</Typography>}
      <ul role="list" className="mb-3 flex flex-col items-start  gap-y-18 self-start">
        {links.map((item, i) => (
          <li key={i}>
            <Link variant="primary" link={item.reference}>
              <Typography as="fragment">{item.name}</Typography>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Column;
