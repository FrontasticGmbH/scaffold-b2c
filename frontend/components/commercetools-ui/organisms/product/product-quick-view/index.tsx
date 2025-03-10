import { FC, useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from 'components/commercetools-ui/organisms/modal';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import useOnClickOutside from 'helpers/hooks/useOnClickOutside';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import { Cart, ShippingMethod } from 'types/entity/cart';
import { Product, Variant } from 'types/entity/product';
import { Wishlist, LineItem } from 'types/entity/wishlist';
import ProductDetailsAdapter from '../product-details/helpers/adapter';

export type QuickViewProps = {
  buttonIsVisible: boolean;
  product: Product;
  wishlist?: Wishlist;
  cart?: Cart;
  shippingMethods?: ShippingMethod[];
  hideButton: () => void;
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  removeFromWishlist?: (item: LineItem) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
};

const QuickView: FC<QuickViewProps> = ({
  buttonIsVisible,
  wishlist,
  cart,
  shippingMethods,
  product,
  hideButton,
  addToWishlist,
  removeFromWishlist,
  onAddToCart,
}) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const { blockScroll } = useScrollBlock();

  const ref = useRef<HTMLDivElement>(null);

  const { formatMessage } = useFormat({ name: 'product' });
  const classNames = useClassNames([
    buttonIsVisible ? 'block' : 'hidden',
    'w-full border border-neutral-400 bg-white py-16 text-center text-12 capitalize leading-[16px] transition duration-150 ease-out hover:border-primary',
  ]);

  const openModal = () => {
    setIsOpen(true);
    blockScroll(true);
    hideButton();
  };

  const closeModal = (shouldRevertScroll: boolean) => {
    setIsOpen(false);
    blockScroll(shouldRevertScroll ? false : true);
  };

  useOnClickOutside(ref, () => closeModal(true));

  return (
    <>
      {!modalIsOpen && (
        <button className={classNames} onClick={openModal}>
          {formatMessage({ id: 'quick.view', defaultMessage: 'Quick view' })}
        </button>
      )}

      <Modal
        shouldCloseOnOverlayClick
        isOpen={modalIsOpen}
        contentLabel={formatMessage({ id: 'quick.view', defaultMessage: 'Quick view' })}
        onRequestClose={() => closeModal(true)}
        preventScroll={false}
        style={{ content: { backgroundColor: 'white' } }}
      >
        <div ref={ref}>
          <XMarkIcon
            className="absolute right-15 top-15 size-24 hover:cursor-pointer"
            strokeWidth={1}
            color="#494949"
            onClick={() => closeModal(true)}
          />
          <ProductDetailsAdapter
            product={product}
            wishlist={wishlist}
            cart={cart}
            shippingMethods={shippingMethods}
            categories={[]}
            inModalVersion={true}
            setIsOpen={setIsOpen}
            onAddToCart={async (variant, quantity) => {
              await onAddToCart?.(variant, quantity);
              closeModal(false);
            }}
            addToWishlist={addToWishlist}
            removeLineItem={removeFromWishlist}
          />
        </div>
      </Modal>
    </>
  );
};

export default QuickView;
