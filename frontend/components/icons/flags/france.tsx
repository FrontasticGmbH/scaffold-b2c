import React from 'react';

type Props = {
  className?: string;
};

const France: React.FC<Props> = ({ className }: Props) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="21" height="14" viewBox="-10 -10 3020 2020">
    <g id="French_Flag_by_Adam_Stanislav">
      <title>Flag of France, by Adam Stanislav</title>
      <rect fill="rgb(0%,14%,58%)" x="0" y="0" width="1010" height="2000" />
      <rect fill="rgb(97%,97%,97%)" x="1000" y="0" width="1010" height="2000" />
      <rect fill="rgb(93%,16%,22%)" x="2000" y="0" width="1000" height="2000" />
      <rect fill="none" stroke="rgb(55%,55%,55%)" strokeWidth="10" x="0" y="0" width="3000" height="2000" />
    </g>
  </svg>
);
export default France;
