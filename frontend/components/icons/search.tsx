import React from 'react';

type Props = {
  className?: string;
};

const Icon: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.32 12.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41v-.01zM8 14A6 6 0 108 2a6 6 0 000 12z"
      fill="#2D3748"
    />
  </svg>
);

export default Icon;
