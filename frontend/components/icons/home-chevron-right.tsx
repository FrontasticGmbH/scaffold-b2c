import React from 'react';

type Props = {
  className?: string;
};

const Icon: React.FC<Props> = ({ className }: Props) => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M1 8.57141L5 4.57141L1 0.571411" stroke="#212121" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Icon;
