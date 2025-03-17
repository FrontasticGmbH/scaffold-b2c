import React, { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import Modal from 'components/commercetools-ui/organisms/modal';

export interface Props {
  modalIsOpen: boolean;
  closeModal: () => void;
  handleCancelClick: () => void;
  handleDeleteClick: () => void;
}

const PaymentDelete: FC<Props> = ({ modalIsOpen, closeModal, handleCancelClick, handleDeleteClick }) => {
  const translate = useTranslations();

  return (
    <Modal
      shouldCloseOnOverlayClick
      preventScroll
      isOpen={modalIsOpen}
      style={{ content: { width: 400, height: 280, overflow: 'hidden' } }}
      contentLabel={translate('common.quick-view')}
      onRequestClose={closeModal}
      className="h-280 w-400 rounded-md border bg-white"
    >
      <div className="mx-auto p-24 md:ml-24 lg:ml-0">
        <div className="flex w-full cursor-pointer justify-end" onClick={closeModal}>
          <XMarkIcon className="w-24 text-gray-600" />
        </div>
        <div className="mt-32 flex h-full flex-col items-center">
          <Typography as="h2" className="text-center text-20 font-medium text-primary">
            {translate('payment.delete-question')}
          </Typography>
          <Typography as="h2" className="mt-24 text-center text-gray-600">
            {translate('payment.delete-warning')}
          </Typography>
          <div className="mt-24 flex">
            <Button variant="secondary" className="w-112" onClick={handleCancelClick}>
              <Typography as="h2" className="text-center text-14 text-primary">
                {translate('payment.cancel')}
              </Typography>
            </Button>

            <Button variant="warning" className="ml-12 w-112" onClick={handleDeleteClick}>
              <Typography as="h2" className="text-center text-14">
                {translate('payment.delete')}
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDelete;
