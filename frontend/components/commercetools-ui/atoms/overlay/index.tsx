import React from 'react';
import useClassNames from 'helpers/hooks/useClassNames';

interface Props {
  zIndex?: number;
  onClick?: () => void;
}

const Overlay: React.FC<Props> = ({ zIndex, onClick }) => {
  //eslint-disable-next-line tailwindcss/no-custom-classname
  const z = `z-[${zIndex ?? 600}]`;
  return (
    <div className={useClassNames(['fixed left-0 top-0 h-screen w-screen bg-[#7f7f7f]/30', z])} onClick={onClick} />
  );
};

export default Overlay;
