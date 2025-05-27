import { TruckIcon } from '@heroicons/react/24/outline';
import { ShippingMethod } from 'shared/types/cart/ShippingMethod';
import { useTranslations } from 'use-intl';
import { classnames } from 'helpers/utils/classnames';

const ShippingSection = ({ shippingMethods }: { shippingMethods?: ShippingMethod[] }) => {
  const translate = useTranslations();

  return (
    <div className="mt-24 grid gap-12">
      <p className="text-14 font-bold leading-[16px] text-gray-700">{translate('checkout.shippingMethods')}</p>
      <div className="overflow-hidden rounded-md border border-neutral-400">
        {(shippingMethods ?? []).map(({ name, description }, index) => (
          <div
            className={classnames('flex items-center gap-20 p-16', { 'border-t border-neutral-400': index > 0 })}
            key={index}
          >
            <TruckIcon width={24} height={24} />
            <div className="grid gap-8">
              {/* Label & Price */}
              <div className="flex flex-wrap gap-16">
                <p className="text-14 font-semibold leading-tight text-gray-700">{description}</p>
              </div>

              {/* Est. delivery date */}
              <div>
                <p className="text-14 leading-tight text-gray-600">{name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingSection;
