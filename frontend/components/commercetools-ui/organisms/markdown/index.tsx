import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Log } from 'helpers/errorLogger';
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import { markdown as MD } from 'markdown';

export interface Props {
  markdown: string;
  className?: string;
}

const Markdown: React.FC<Props> = ({ markdown }) => {
  const [safeMarkdown, setSafeMarkdown] = useState('');

  useEffect(() => {
    if (typeof markdown === 'string') setSafeMarkdown(DOMPurify.sanitize(MD.toHTML(markdown)));
  }, [markdown]);

  if (typeof markdown !== 'string') {
    Log.error(new Error(`Markdown: Invalid markdown property. Expected string but received ${typeof markdown}`));

    return <></>;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: safeMarkdown }}></div>
    </>
  );
};

export default Markdown;
