import React from 'react';

type Props = {
  className?: string;
};

const Icon: React.FC<Props> = ({ className }: Props) => (
  <svg
    width="100%"
    height="100%"
    className={className}
    viewBox="0 0 18 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 16.7V19a1 1 0 11-2 0v-5a1 1 0 011-1h5a1 1 0 010 2H4.1A7 7 0 0016 10a1 1 0 012 0 9 9 0 01-15 6.7zM15 3.3V1a1 1 0 012 0v5a1 1 0 01-1 1h-5a1 1 0 110-2h2.9A7 7 0 002 10a1 1 0 11-2 0 9 9 0 0115-6.7z" />
  </svg>
);

export default Icon;
