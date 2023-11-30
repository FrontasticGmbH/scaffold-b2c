import React from 'react';

interface Props {
  onClick?: () => void;
}

const Overlay: React.FC<Props> = ({ onClick }) => {
  //eslint-disable-next-line tailwindcss/no-custom-classname
  return <div className="fixed left-0 top-0 z-[250] h-screen w-screen bg-[#7f7f7f]/30" onClick={onClick} />;
};

export default Overlay;
