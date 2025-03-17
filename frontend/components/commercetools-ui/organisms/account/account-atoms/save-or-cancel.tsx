import { ComponentProps, FC } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import useClassNames from 'helpers/hooks/useClassNames';

export interface SaveOrCancelProps extends ComponentProps<'div'> {
  variant?: 'save' | 'delete';
  loading?: boolean;
  onSave?: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SaveOrCancel: FC<SaveOrCancelProps> = ({ variant = 'save', loading, className, onSave, onCancel }) => {
  const translate = useTranslations();

  const containerClassName = useClassNames(['flex gap-12', className]);

  return (
    <div className={containerClassName}>
      <Button
        type="button"
        variant="secondary"
        className="flex h-40 w-112 items-center justify-center p-0 text-14"
        onClick={onCancel}
      >
        {translate('common.cancel')}
      </Button>

      {variant == 'save' ? (
        <Button loading={loading} type="submit" className="h-40 w-112 p-0 text-14" onClick={onSave}>
          {translate('common.save')}
        </Button>
      ) : (
        <Button loading={loading} variant="warning" type="submit" className="h-40 w-112 px-0 text-14" onClick={onSave}>
          {translate('common.delete')}
        </Button>
      )}
    </div>
  );
};

export default SaveOrCancel;
