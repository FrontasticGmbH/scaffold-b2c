import { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Typography from 'components/commercetools-ui/atoms/typography';
import Modal from 'components/commercetools-ui/organisms/modal';
import { useFormat } from 'helpers/hooks/useFormat';
import SaveOrCancel from '../../account-atoms/save-or-cancel';

type DeleteModalProps = {
  modalIsOpen: boolean;
  loading: boolean;
  closeModal: () => void;
  handleDelete: () => void;
};

const DeleteModal: FC<DeleteModalProps> = ({ modalIsOpen, loading, closeModal, handleDelete }) => {
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage } = useFormat({ name: 'common' });

  return (
    <Modal
      shouldCloseOnOverlayClick
      isOpen={modalIsOpen}
      style={{ content: { width: 400, height: 280, overflow: 'hidden', background: 'white' } }}
      contentLabel={formatMessage({ id: 'quick.view', defaultMessage: 'Quick view' })}
      onRequestClose={closeModal}
    >
      <>
        <XMarkIcon
          className="absolute right-15 top-15 h-24 w-24 hover:cursor-pointer"
          strokeWidth={1}
          color="#494949"
          onClick={closeModal}
        />

        <div className="m-auto grid h-full place-content-center gap-24">
          <Typography as="h3" className="text-center text-20 font-medium text-primary-black">
            {formatAccountMessage({ id: 'delete.address', defaultMessage: 'Delete address' })}
          </Typography>
          <Typography as="p" className="text-center text-secondary-black">
            {formatAccountMessage({ id: 'action.warning', defaultMessage: 'This action can not be undone.' })}
          </Typography>

          <SaveOrCancel loading={loading} onCancel={closeModal} variant="delete" onSave={handleDelete} />
        </div>
      </>
    </Modal>
  );
};

export default DeleteModal;
