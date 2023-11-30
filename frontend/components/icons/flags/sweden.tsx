import React from 'react';

type Props = {
  className?: string;
};

const Sweden: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 16 10">
    <path fill="#006aa7" d="M0,0H16V10H0Z" />
    <path fill="#fecc00" d="M0,4H5V0H7V4H16V6H7V10H5V6H0Z" />
  </svg>
);
export default Sweden;
