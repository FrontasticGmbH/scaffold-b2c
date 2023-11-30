import React from 'react';

type Props = {
  className?: string;
};

const Icon: React.FC<Props> = ({ className }: Props) => (
  <svg
    width="100%"
    height="100%"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.146 5.4l-2.792-2.8a.5.5 0 00-.708 0L7.854 14.4a.5.5 0 01-.708 0l-2.792-2.8a.5.5 0 00-.708 0L.854 14.4a.5.5 0 000 .707L7.146 21.4a.5.5 0 00.708 0L23.146 6.1a.5.5 0 000-.7z" />
  </svg>
);

export default Icon;
