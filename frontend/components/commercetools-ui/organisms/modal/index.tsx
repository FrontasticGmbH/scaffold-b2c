import { FC, useEffect } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import ReactModal, { Props as ReactModalProps } from 'react-modal';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
//import useScrollBlock from 'helpers/hooks/useScrollBlock';
import { desktop } from 'helpers/utils/screensizes';

export interface ModalProps extends ReactModalProps {
  closeButton?: boolean;
}

const Modal: FC<ModalProps> = ({ children, style, preventScroll, closeButton, className = '', ...props }) => {
  const [isDesktopSize] = useMediaQuery(desktop);

  //const { blockScroll } = useScrollBlock();

  const modalStyle: ReactModalProps['style'] = {
    overlay: {
      zIndex: 51,
      backgroundColor: 'rgba(127 ,127, 127, .3)',
      ...style?.overlay,
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: isDesktopSize ? 800 : '100%',
      position: 'relative',
      padding: 0,
      ...style?.content,
    },
  };

  useEffect(() => {
    if (preventScroll) document.body.style.overflow = props.isOpen ? 'hidden' : 'auto';
  }, [props.isOpen, preventScroll]);
  /*
  useEffect(() => {
    blockScroll(props.isOpen);
  }, [props.isOpen, blockScroll]);*/

  return (
    <ReactModal
      {...props}
      ariaHideApp={false}
      style={modalStyle}
      preventScroll={preventScroll}
      className={`${className} relative`}
      parentSelector={() => document.getElementById('react-modal-custom-portal') ?? document.body}
    >
      {closeButton && (
        <CloseIcon
          className="absolute right-20 top-20 size-24 cursor-pointer text-gray-600"
          onClick={props.onRequestClose}
        />
      )}
      {children}
    </ReactModal>
  );
};

export default Modal;
