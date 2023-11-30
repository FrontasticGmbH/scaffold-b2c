import React from 'react';

type Props = {
  className?: string;
  onClick?: () => void;
};

const Icon: React.FC<Props> = ({ className, onClick }: Props) => (
  <svg
    width="100%"
    height="100%"
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path d="M13.2857 0.857137L12.551 0L6.85713 6.64286L1.16325 0L0.428558 0.857137L6.12244 7.5L0.428558 14.1429L1.16325 15L6.85713 8.35714L12.551 15L13.2857 14.1429L7.59182 7.5L13.2857 0.857137Z" />
  </svg>
);

export default Icon;
