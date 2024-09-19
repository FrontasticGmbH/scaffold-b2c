import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import { useFormat } from 'helpers/hooks/useFormat';
import { CartProps } from '../types';

type Props = Pick<CartProps, 'categories' | 'emptyStateDescription'>;

const EmptyCart = ({ categories, emptyStateDescription }: Props) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });

  return (
    <div className="mt-28">
      <p>
        {emptyStateDescription ??
          formatCartMessage({ id: 'cart.empty.ask', defaultMessage: 'Your cart is empty. Continue shopping?' })}
      </p>
      <ul className="mt-48 flex flex-col items-center gap-y-20 pb-8 lg:items-start">
        {categories
          .filter((category) => category.depth === 0)
          .map((category) => (
            <li key={category.name}>
              <Link link={category._url}>
                <Button
                  className="w-200 rounded-md border border-primary-black text-16 text-secondary-black"
                  variant="secondary"
                >
                  {category.name}
                </Button>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EmptyCart;
