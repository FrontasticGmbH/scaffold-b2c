import { ComponentProps, FC, useEffect } from 'react';
import { useTranslations } from 'use-intl';
import SaveOrCancel, {
  SaveOrCancelProps,
} from 'components/commercetools-ui/organisms/account/account-atoms/save-or-cancel';
import useClassNames from 'helpers/hooks/useClassNames';
import useDiscardForm from '../hooks/useDiscardForm';

export interface AccountFormProps extends ComponentProps<'form'> {
  title: string;
  subtitle?: string;
  containerClassName?: string;
  requiredLabelIsVisible?: boolean;
  defaultCTASection?: boolean;
  ctaVariant?: SaveOrCancelProps['variant'];
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const AccountForm: FC<AccountFormProps> = ({
  className,
  containerClassName,
  title,
  subtitle,
  loading,
  requiredLabelIsVisible,
  ctaVariant,
  defaultCTASection,
  onSubmit,
  children,
}) => {
  const { discardForm } = useDiscardForm();

  const translate = useTranslations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const formClassName = useClassNames(['pt-24 pb-40 px-16 md:px-24 lg:px-44', className]);

  const containerClassNames = useClassNames(['max-w-[372px]', containerClassName]);

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <p className="text-16 text-primary md:mb-28 md:text-24">{title}</p>

      <div className="relative border-neutral-400 pb-8 pt-24 md:border md:p-32 md:pr-68">
        {subtitle && <p className="mb-28 text-14 leading-loose text-primary md:mb-40 md:text-16">{subtitle}</p>}

        <div className={containerClassNames}>
          {children}

          {defaultCTASection && (
            <div className="mt-24 grid items-center justify-between gap-32 md:flex md:gap-16">
              {requiredLabelIsVisible && (
                <p className="text-14 leading-[114%] text-gray-600">{translate('common.field-required')}</p>
              )}

              <SaveOrCancel onCancel={discardForm} onSave={handleSubmit} loading={loading} variant={ctaVariant} />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default AccountForm;
