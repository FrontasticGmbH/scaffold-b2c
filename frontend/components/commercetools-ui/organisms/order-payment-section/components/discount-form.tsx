import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import AccordionBtn, { AccordionProps } from 'components/commercetools-ui/atoms/accordion';
import CloseIcon from 'components/icons/close';
import useClassNames from 'helpers/hooks/useClassNames';
import { DiscountCode } from 'types/entity/cart';

export interface Props {
  className?: string;
  accordionProps?: AccordionProps;
  discounts: DiscountCode[];
  onApplyDiscountCode?: (code: string) => Promise<void>;
  onRemoveDiscountCode?: (discount: DiscountCode) => Promise<void>;
}

const DiscountForm: React.FC<Props> = ({
  className,
  accordionProps,
  discounts,
  onApplyDiscountCode,
  onRemoveDiscountCode,
}) => {
  const translate = useTranslations();

  const [code, setCode] = useState('');
  const [codeIsInvalid, setCodeIsInvalid] = useState(false);
  const [erroMessage, setErrorMessage] = useState('');

  const [processing, setProcessing] = useState(false);

  const inputClassName = useClassNames([
    'h-40 w-full border rounded-sm px-10 py-12 text-14 placeholder:text-gray-600 disabled:bg-neutral-300 focus:outline-none',
    codeIsInvalid ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-neutral-300',
  ]);

  const discountsContainerClassName = useClassNames([
    'mt-8 flex flex-wrap justify-items-start gap-12',
    discounts?.length === 0 ? 'pt-0' : 'pt-4',
  ]);

  const containerClassName = useClassNames(['py-16 text-16 border-t border-neutral-400 text-14', className]);

  const onApplyDiscount = () => {
    if (processing || !code) return;

    setProcessing(true);

    onApplyDiscountCode?.(code)
      .then(() => setCode(''))
      .catch((err: Error) => {
        if (err.message.includes('MaxApplicationReached')) {
          setErrorMessage(
            translate('cart.voucher-max-usage-singular', {
              codes: '',
            }),
          );
        } else {
          setErrorMessage(translate('cart.codeNotValid'));
        }

        setCodeIsInvalid(true);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setCodeIsInvalid(false);
  };

  const handleRemove = (discount: DiscountCode) => {
    onRemoveDiscountCode?.(discount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyDiscount();
  };

  const resetCode = () => {
    setCode('');
    setCodeIsInvalid(false);
  };

  return (
    <div className={containerClassName}>
      <AccordionBtn
        closedSectionTitle={translate('cart.discount-apply')}
        buttonClassName="text-gray-600 "
        {...accordionProps}
      >
        <div>
          <form className="mt-24" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                className={inputClassName}
                value={code}
                placeholder={translate('cart.cart-discount-enter')}
                onChange={handleChange}
                disabled={processing}
              />
              {codeIsInvalid && (
                <span
                  className="absolute right-16 top-1/2 -translate-y-1/2"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetCode();
                  }}
                >
                  <CloseIcon className="size-10 cursor-pointer" />
                </span>
              )}
            </div>
            {codeIsInvalid && (
              <p className="mt-16 font-body text-12 font-medium leading-normal text-red-500">{erroMessage}</p>
            )}
          </form>

          {discounts && !!discounts.length && (
            <div className={discountsContainerClassName}>
              {discounts.map((discount) => (
                <div
                  key={discount.discountCodeId}
                  className="mr-2 flex w-fit justify-between gap-8 rounded-sm border border-neutral-400 bg-white px-8 py-4"
                >
                  <label className="text-12 uppercase leading-[16px] text-gray-600">{discount.code}</label>
                  <button type="button" onClick={() => handleRemove(discount)}>
                    <XMarkIcon className="size-16 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </AccordionBtn>
    </div>
  );
};

export default DiscountForm;
