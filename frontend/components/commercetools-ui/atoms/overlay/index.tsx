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
    <div
      data-testid="overlay"
      className={useClassNames(['fixed left-0 top-0 h-screen w-screen bg-gray-400/30', z])}
      onClick={onClick}
    />
  );
};

export default Overlay;
