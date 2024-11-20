import { useContext } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import { AccountContext } from 'context/account';
import { CartProps } from '../types';

type Props = Pick<
  CartProps,
  | 'categories'
  | 'emptyStateTitle'
  | 'emptyStateDescription'
  | 'emptyStateImage'
  | 'emptyStateLinkText'
  | 'emptyStateReference'
>;

const EmptyCart = ({
  categories,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateImage,
  emptyStateLinkText,
  emptyStateReference,
}: Props) => {
  const { loggedIn } = useContext(AccountContext);

  return (
    <div className="flex flex-col items-center gap-36">
      <p className="text-center text-28 leading-normal">{emptyStateTitle}</p>

      <div className="w-full max-w-305">
        <div className="relative pb-[48%]">
          <Image {...emptyStateImage} fill />
        </div>
      </div>

      <div>
        <p className="text-center leading-loose">{emptyStateDescription}</p>

        <div className="mt-16">
          {loggedIn ? (
            <ul className="flex flex-col items-center gap-8 px-4 pb-8 xl:flex-row xl:flex-wrap">
              {categories
                .filter((category) => category.depth === 0)
                .map((category) => (
                  <li key={category.name}>
                    <Link link={category._url}>
                      <Button
                        className="w-fit min-w-150 items-center rounded-md border border-primary-black text-16 text-secondary-black"
                        variant="secondary"
                      >
                        {category.name}
                      </Button>
                    </Link>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="flex w-full justify-center">
              <Link link={emptyStateReference}>
                <Button variant="primary">{emptyStateLinkText}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
