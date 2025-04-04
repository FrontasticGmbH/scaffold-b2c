import React from 'react';

interface Props {
  zIndex?: number;
  onClick?: () => void;
}

const Overlay: React.FC<Props> = ({ zIndex, onClick }) => {
  return (
    <div
      data-testid="overlay"
      className="fixed left-0 top-0 h-screen w-screen bg-gray-400/30"
      style={{ zIndex: zIndex ?? 600 }}
      onClick={onClick}
    />
  );
};

export default Overlay;
