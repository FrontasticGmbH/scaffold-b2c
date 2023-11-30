import React from 'react';

export interface Props {
  content?: string;
}

const Showcase: React.FC<Props> = ({ content }) => {
  return <div className="w-full border border-solid border-slate-300 p-4 text-slate-600 md:p-8">{content}</div>;
};

export default Showcase;
