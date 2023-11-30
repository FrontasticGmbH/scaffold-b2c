import React from 'react';

type Props = {
  className?: string;
};

const Icon: React.FC<Props> = ({ className }: Props) => (
  <svg
    width="1em"
    height="1em"
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="8.5" strokeWidth="3" />
    <path
      d="M6.25 11.125L8.02971 12.9158C8.46424 13.3531 9.18705 13.2969 9.54876 12.7977L13.75 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Icon;
