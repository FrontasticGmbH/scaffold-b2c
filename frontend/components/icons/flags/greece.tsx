import React from 'react';

type Props = {
  className?: string;
};

const Greece: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="0 0 27 18">
    <desc>Flag of Greece</desc>
    <rect fill="#0D5EAF" width="27" height="18" />
    <path fill="none" strokeWidth="2" stroke="#FFF" d="M5,0V11 M0,5H10 M10,3H27 M10,7H27 M0,11H27 M0,15H27" />
  </svg>
);
export default Greece;
