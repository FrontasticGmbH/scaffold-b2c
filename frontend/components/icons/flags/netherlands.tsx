import React from 'react';

type Props = {
  className?: string;
};

const Netherlands: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 9 6">
    <desc>Flag of Netherlands</desc>
    <rect fill="#21468B" width="9" height="6" />
    <rect fill="#FFF" width="9" height="4" />
    <rect fill="#AE1C28" width="9" height="2" />
  </svg>
);
export default Netherlands;
