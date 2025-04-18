import React, { useRef, useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslations } from 'use-intl';
import Slider from 'components/commercetools-ui/atoms/slider';
import Wrapper from 'components/HOC/wrapper';
import useClassNames from 'helpers/hooks/useClassNames';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { Order } from 'types/entity/order';
import OrderItem from './OrderItem';

export interface StatusTab {
  name: string;
  slug: string;
}

interface Props {
  orders: Order[];
  loading?: boolean;
}

const Orders = ({ orders, loading }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLargeMobileScreen] = useMediaQuery(325);
  const translate = useTranslations();
  const [overflow, setOverflow] = useState<boolean | undefined>(undefined);

  const statusTabs: StatusTab[] = [
    { name: translate('orders.all-orders'), slug: 'allorders' },
    { name: translate('orders.confirmed'), slug: 'confirmed' },
    { name: translate('orders.complete'), slug: 'complete' },
    { name: translate('orders.cancelled'), slug: 'cancelled' },
  ];
  const [selectedTab, setSelectedTab] = useState(statusTabs[0].slug);
  const [leftArrowAppear, setLeftArrowAppear] = useState<boolean | undefined>(undefined);
  const [rightArrowAppear, setRightArrowAppear] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (overflow || !isLargeMobileScreen) {
      setRightArrowAppear(true);
    }
  }, [leftArrowAppear, rightArrowAppear, isLargeMobileScreen, overflow]);

  const orderHistoryContent = useMemo(() => {
    if (selectedTab === 'allorders') return orders;
    else return orders?.filter((order: Order) => order.orderState === selectedTab);
  }, [selectedTab, orders]);

  const tabTextClassNames = (tab: StatusTab) => {
    return `border-primary pb-8 ${tab.slug === selectedTab ? 'border-b-2 text-primary font-medium' : 'text-gray-600'}`;
  };

  const mobileStatusWrapper = useClassNames([
    'h-fit w-full',
    leftArrowAppear === true ? 'pl-36' : 'pl-16',
    rightArrowAppear === true ? 'pr-36' : 'pr-16',
    { 'flex justify-center px-16': !overflow },
  ]);

  const swiperReachBeginning = useCallback(() => {
    if (!overflow) {
      setRightArrowAppear(false);
    } else {
      setRightArrowAppear(true);
    }
    setLeftArrowAppear(false);
  }, [overflow]);

  const swiperReachEnd = useCallback(() => {
    if (!overflow) {
      setLeftArrowAppear(false);
    } else {
      setLeftArrowAppear(true);
    }
    setRightArrowAppear(false);
  }, [overflow]);

  useLayoutEffect(() => {
    if (ref?.current && ref.current.clientWidth < ref?.current.scrollWidth) setOverflow(true);
  }, [ref]);

  return (
    <>
      {loading ? (
        <div className="px-12">
          <Skeleton className="h-30" />
        </div>
      ) : (
        <>
          <h1 className="mt-20 hidden text-22 text-primary md:ml-24 md:block lg:ml-44 lg:mt-42 lg:text-24">
            {translate('orders.orders')}
          </h1>

          <div className="mt-20 px-16 md:mt-36 md:px-24 lg:px-44">
            <p className="text-14 text-gray-600 md:text-16">{translate('orders.help-question')}</p>
          </div>

          <div className="mt-16">
            <Wrapper className="relative h-32 w-full border-b-2 border-neutral-400 md:hidden">
              <div className={mobileStatusWrapper} ref={ref}>
                <Slider
                  onReachEnd={swiperReachEnd}
                  onReachBeginning={swiperReachBeginning}
                  slideWidthIsFlexible
                  dots={false}
                  prevButtonStyles={{
                    left: '-20px',
                    transform: 'translateY(-70%) rotateZ(135deg) scale(0.55)',
                    borderWidth: '0 3px 3px 0',
                  }}
                  nextButtonStyles={{
                    right: '-20px',
                    transform: ' translateY(-70%) rotateZ(-45deg) scale(0.55)',
                    borderWidth: '0 3px 3px 0',
                  }}
                  allowTouchMove
                  allowArrowsOnTouchDevice
                  arrows={overflow}
                  spaceBetween={20}
                >
                  {statusTabs.map((tab) => (
                    <div
                      key={tab.slug}
                      onClick={() => setSelectedTab(tab.slug)}
                      className="w-fit cursor-pointer whitespace-nowrap"
                    >
                      <p className={`${tabTextClassNames(tab)} text-14`}>{tab.name}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </Wrapper>
          </div>

          <div className="px-16 md:px-24 lg:px-44">
            <div className="relative hidden h-58 w-full border-b-2 border-neutral-400 pt-24 md:flex">
              <div className="absolute flex h-fit w-2/5 justify-between">
                {statusTabs.map((tab) => (
                  <div
                    key={tab.slug}
                    onClick={() => setSelectedTab(tab.slug)}
                    className="cursor-pointer whitespace-nowrap pr-36"
                  >
                    <p className={tabTextClassNames(tab)}>{tab.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-auto px-16 py-24 md:px-24 lg:px-44">
            {orderHistoryContent?.map((order?: Order) => <OrderItem key={order?.orderId} order={order} />)}
          </div>
        </>
      )}
    </>
  );
};

export default Orders;
