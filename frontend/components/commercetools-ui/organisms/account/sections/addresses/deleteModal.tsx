import { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';
import Modal from 'components/commercetools-ui/organisms/modal';
import SaveOrCancel from '../../account-atoms/save-or-cancel';

type DeleteModalProps = {
  modalIsOpen: boolean;
  loading: boolean;
  closeModal: () => void;
  handleDelete: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({ modalIsOpen, loading, closeModal, handleDelete }) => {
  const translate = useTranslations();

  return (
    <Modal
      shouldCloseOnOverlayClick
      isOpen={modalIsOpen}
      style={{ content: { width: 400, height: 280, overflow: 'hidden', background: 'white' } }}
      contentLabel={translate('common.quick-view')}
      onRequestClose={closeModal}
    >
      <>
        <XMarkIcon
          className="absolute right-15 top-15 size-24 hover:cursor-pointer"
          strokeWidth={1}
          color="#494949"
          onClick={closeModal}
        />

        <div className="m-auto grid h-full place-content-center gap-24">
          <Typography as="h3" className="text-center text-20 font-medium text-primary">
            {translate('account.delete-address')}
          </Typography>
          <Typography as="p" className="text-center text-gray-600">
            {translate('account.action-warning')}
          </Typography>

          <SaveOrCancel loading={loading} onCancel={closeModal} variant="delete" onSave={handleDelete} />
        </div>
      </>
    </Modal>
  );
};

export default DeleteModal;
