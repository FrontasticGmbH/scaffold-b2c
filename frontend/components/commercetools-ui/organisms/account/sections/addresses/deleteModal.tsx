import { FC } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Modal from 'components/commercetools-ui/organisms/modal';
import { Link } from 'i18n/routing';
import SaveOrCancel from '../../account-atoms/save-or-cancel';

type DeleteModalProps = {
  modalIsOpen: boolean;
  loading: boolean;
  closeModal: () => void;
  handleDelete: () => void;
  isDefault?: boolean;
};

const DeleteModal: FC<DeleteModalProps> = ({ modalIsOpen, loading, closeModal, handleDelete, isDefault }) => {
  const translate = useTranslations();

  const canDeleteContent = (
    <>
      <div className="border-b border-gray-300 p-24">
        <h3 className="text-20 font-semibold text-gray-700">{translate('account.delete-address')}</h3>

        <p className="mt-12 text-14 text-gray-700">{translate('account.action-warning')}</p>
      </div>

      <div className="p-24">
        <SaveOrCancel
          loading={loading}
          onCancel={closeModal}
          variant="delete"
          translations={{ delete: translate('account.delete-address') }}
          onSave={handleDelete}
          className="flex-col md:flex-row"
        />
      </div>
    </>
  );

  const canNotDeleteContent = (
    <>
      <div className="p-24">
        <h3 className="text-20 font-semibold text-gray-700">{translate('account.delete-failed')}</h3>
        <p
          className="mt-12 text-14 text-gray-700"
          dangerouslySetInnerHTML={{
            __html: translate.markup('account.unable-to-delete-due-to-default', {
              highlight: (chunk) => `<span class="text-red-600">${chunk}</span>`,
            }),
          }}
        />
      </div>
      <div className="border-t border-gray-300 p-24">
        <Link href="/account/?hash=addresses">
          <Button className="w-full" size="s">
            {translate('account.update-default-address')}
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <Modal
      shouldCloseOnOverlayClick
      isOpen={modalIsOpen}
      style={{ content: { width: 'fit', maxWidth: 'min(90%, 425px)' } }}
      contentLabel={translate('common.quick-view')}
      onRequestClose={closeModal}
      closeButton
    >
      {isDefault ? canNotDeleteContent : canDeleteContent}
    </Modal>
  );
};

export default DeleteModal;
