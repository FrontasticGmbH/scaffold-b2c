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
    <path d="M4 8V5a5 5 0 1110 0v3h2a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2v-8c0-1.1.9-2 2-2h2zm2 0h6V5a3 3 0 00-6 0v3zm-4 2v8h14v-8H2zm7 2a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z" />
  </svg>
);

export default Icon;
