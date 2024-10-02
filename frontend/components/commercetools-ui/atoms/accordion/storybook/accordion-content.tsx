import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Skeleton from 'react-loading-skeleton';
import Image from 'components/commercetools-ui/atoms/image';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { accordionFAQMockItems, accordionMockItems } from 'helpers/mocks/mockAtomsData';
import { lineItems } from 'helpers/mocks/mockCommonData';
import { variant } from 'helpers/mocks/mockData';
import Typography from '../../typography';
import Accordion from '../index';

const AccordionContent = () => {
  return (
    <div className="ml-44">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Accordion</Typography>
      <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Accordion component allows customers to toggle between showing and hiding content within a single space.
      </Typography>

      <Typography className="mt-40 w-2/5 text-24 font-medium text-black">Normal accordion</Typography>
      <div className="mt-16 flex w-1/2 justify-start">
        <div className="flex w-full flex-col items-stretch gap-8">
          {accordionMockItems.map((item, index) => (
            <Accordion
              key={index}
              variant="arrow"
              closedSectionTitle={item.title}
              openSectionTitle={item.title}
              className={`p-8 ${index < accordionMockItems.length - 1 ? 'border-b-2' : ''}`}
              panelClassName="p-8 text-secondary-black"
            >
              {item.content}
            </Accordion>
          ))}
        </div>
      </div>

      <Typography className="mt-32 w-2/5 text-24 font-medium text-black">FAQ accordion</Typography>

      <div className="mt-16 flex w-1/2 flex-col items-stretch gap-8">
        {accordionFAQMockItems.map((item, index) => (
          <Accordion
            key={index}
            variant="plusAndMinus"
            closedSectionTitle={item.title}
            openSectionTitle={item.title}
            className={`p-8 ${index < accordionFAQMockItems.length - 1 ? 'border-b-2' : ''}`}
            panelClassName="p-8 text-secondary-black"
          >
            {item.content}
          </Accordion>
        ))}
      </div>

      <Typography className="mt-32 w-2/5 text-24 font-medium text-black">Custom accordion</Typography>

      <div className="mt-16">
        <Accordion
          className="hidden lg:block lg:pt-0"
          buttonClassName="py-16 border-y border-neutral-400"
          panelClassName="w-[24%] border-0"
          customClosedButton={
            <div className="hidden gap-20 lg:flex">
              <div className="grid max-h-104 grid-cols-3 gap-16 overflow-hidden">
                {lineItems?.map((lineItem) => (
                  <div key={lineItem.lineItemId} className="relative h-104 w-88 shrink-0">
                    {lineItem?.variant?.images?.[0] ? (
                      <Image fill src={variant?.images?.[0]} style={{ objectFit: 'contain' }} />
                    ) : (
                      <Skeleton className="size-full" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex cursor-pointer items-center">
                <span className="text-14 text-secondary-black">+{2}</span>
                <ChevronDownIcon strokeWidth={1} className="w-24" />
              </div>
            </div>
          }
        >
          <div className="max-h-316 divide-y divide-neutral-400 overflow-scroll">
            {lineItems?.map((lineItem, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-start gap-16 py-16 md:gap-32">
                  <div className="relative h-104 w-89 shrink-0">
                    {lineItem?.variant?.images?.[0] ? (
                      <Image fill src={variant?.images?.[0]} style={{ objectFit: 'contain' }} />
                    ) : (
                      <Skeleton className="size-full" />
                    )}
                  </div>
                  <div className="mt-10 grow overflow-hidden">
                    <Typography
                      asSkeleton={!lineItem.name}
                      className="block max-w-full truncate text-12 capitalize md:text-14"
                    >
                      {lineItem.name ?? 'product name'}
                    </Typography>
                    <Typography
                      asSkeleton={!lineItem.name}
                      className="mt-8 block text-12 font-medium md:hidden lg:block lg:text-14"
                    >
                      {CurrencyHelpers.formatForCurrency(lineItem.price ?? 111, 'en')}
                    </Typography>
                    <Typography asSkeleton={!lineItem.name} className="mt-12 text-14 text-secondary-black">
                      {'x ' + (lineItem.count ?? '2')}
                    </Typography>
                  </div>
                </div>
                <Typography asSkeleton={!lineItem.name} className="mt-8 hidden font-medium md:block lg:hidden">
                  {CurrencyHelpers.formatForCurrency(lineItem.price ?? 111, 'en')}
                </Typography>
              </div>
            ))}
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default AccordionContent;
