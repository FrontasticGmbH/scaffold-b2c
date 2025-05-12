import { ComponentProps, FC } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import useClassNames from 'helpers/hooks/useClassNames';

export interface SaveOrCancelProps extends ComponentProps<'div'> {
  translations?: {
    save?: string;
    cancel?: string;
    delete?: string;
  };
  variant?: 'save' | 'delete';
  loading?: boolean;
  onSave?: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SaveOrCancel: FC<SaveOrCancelProps> = ({
  variant = 'save',
  loading,
  className,
  onSave,
  onCancel,
  translations = {},
}) => {
  const translate = useTranslations();

  const containerClassName = useClassNames(['flex gap-12', className]);

  return (
    <div className={containerClassName}>
      <Button type="button" variant="secondary" className="min-w-150" onClick={onCancel}>
        {translations.cancel ?? translate('common.cancel')}
      </Button>

      {variant == 'save' ? (
        <Button loading={loading} type="submit" className="grow" onClick={onSave}>
          {translations.save ?? translate('common.save')}
        </Button>
      ) : (
        <Button loading={loading} variant="warning" type="submit" className="grow" onClick={onSave}>
          {translations.delete ?? translate('common.delete')}
        </Button>
      )}
    </div>
  );
};

export default SaveOrCancel;
