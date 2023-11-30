import React from 'react';

type Props = {
  className?: string;
};

const Italy: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="30" height="20" viewBox="0 0 3 2">
    <desc>Flag of Italy</desc>
    <rect width="3" height="2" fill="#009246" />
    <rect width="2" height="2" x="1" fill="#fff" />
    <rect width="1" height="2" x="2" fill="#ce2b37" />
  </svg>
);
export default Italy;
