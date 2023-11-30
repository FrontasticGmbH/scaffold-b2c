import React, { useRef, useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Order } from 'shared/types/cart/Order';
import Slider from 'components/commercetools-ui/atoms/slider';
import Typography from 'components/commercetools-ui/atoms/typography';
import Wrapper from 'components/HOC/wrapper';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import useOrderFetch from './helper-hooks/useOrderFetch';
import OrderItem from './OrderItem';

export interface StatusTab {
  name: string;
  slug: string;
}

const Orders = () => {
  const { orders, loading } = useOrderFetch();
  const ref = useRef<HTMLDivElement>(null);
  const [isLargeMobileScreen] = useMediaQuery(325);
  const { formatMessage: formatOrdersMessage } = useFormat({ name: 'orders' });
  const [overflow, setOverflow] = useState<boolean | undefined>(undefined);

  const statusTabs: StatusTab[] = [
    { name: formatOrdersMessage({ id: 'all.orders', defaultMessage: 'All orders' }), slug: 'allOrders' },
    { name: formatOrdersMessage({ id: 'Confirmed', defaultMessage: 'Registered' }), slug: 'Confirmed' },
    { name: formatOrdersMessage({ id: 'Complete', defaultMessage: 'Delivered' }), slug: 'Complete' },
    { name: formatOrdersMessage({ id: 'Cancelled', defaultMessage: 'Returned' }), slug: 'Cancelled' },
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
    if (selectedTab === 'allOrders') return orders;
    else return orders?.filter((order: Order) => order.orderState === selectedTab);
  }, [selectedTab, orders]);

  const tabTextClassNames = (tab: StatusTab) => {
    return `border-primary-black pb-8 ${
      tab.slug === selectedTab ? 'border-b-2 text-primary-black font-medium' : 'text-secondary-black'
    }`;
  };

  const mobileStatusWrapper = useClassNames([
    'h-fit w-full',
    leftArrowAppear === true ? 'pl-36' : 'pl-16',
    rightArrowAppear === true ? 'pr-36' : 'pr-16',
    !overflow && 'flex justify-center px-16',
  ]);

  const swiperReachBeginning = useCallback(() => {
    !overflow ? setRightArrowAppear(false) : setRightArrowAppear(true);
    setLeftArrowAppear(false);
  }, [overflow]);

  const swiperReachEnd = useCallback(() => {
    !overflow ? setLeftArrowAppear(false) : setLeftArrowAppear(true);
    setRightArrowAppear(false);
  }, [overflow]);

  useLayoutEffect(() => {
    if (ref?.current && ref.current.clientWidth < ref?.current.scrollWidth) setOverflow(true);
  }, [ref]);

  return (
    <>
      {loading ? (
        <div className="px-12">
          <Skeleton className="h-[30px]" />
        </div>
      ) : (
        <>
          <Typography
            as="h2"
            className="mt-20 hidden text-22 text-primary-black md:ml-24 md:block lg:ml-44 lg:mt-42 lg:text-24"
          >
            {formatOrdersMessage({
              id: 'orders',
              defaultMessage: 'Orders',
            })}
          </Typography>

          <div className="mt-20 px-16 md:mt-36 md:px-24 lg:px-44">
            <Typography className="text-14 text-secondary-black md:text-16">
              {formatOrdersMessage({
                id: 'help.question',
                defaultMessage: 'Check status of recent orders, manage your returns and download invoices.',
              })}
            </Typography>
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
                      <Typography className={`${tabTextClassNames(tab)} text-14`}>{tab.name}</Typography>
                    </div>
                  ))}
                </Slider>
              </div>
            </Wrapper>
          </div>

          <div className="px-16 md:px-24 lg:px-44">
            <div className="relative hidden h-58 w-full border-b-2 border-neutral-400 pt-24 md:flex">
              <div className="absolute flex h-fit w-[40%] justify-between">
                {statusTabs.map((tab) => (
                  <div
                    key={tab.slug}
                    onClick={() => setSelectedTab(tab.slug)}
                    className="cursor-pointer whitespace-nowrap pr-36"
                  >
                    <Typography className={tabTextClassNames(tab)}>{tab.name}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-auto px-16 py-24 md:px-24 lg:px-44">
            {orderHistoryContent?.map((order?: Order) => (
              <OrderItem key={order?.orderId} order={order} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Orders;
