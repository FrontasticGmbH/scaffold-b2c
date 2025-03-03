import React, { useCallback, useEffect, useState } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import MarketButton from 'components/commercetools-ui/organisms/market-button/market-button';
import { Reference } from 'types/reference';

export interface Props {
  text: string;
  highlightedSubstring: string;
  target?: Reference;
}

const AnnouncementBar: React.FC<Props> = ({ text, highlightedSubstring, target }) => {
  const [previewText, setPreviewText] = useState({ prefix: text, middle: '', suffix: '' });

  const processHighlighting = useCallback(() => {
    const start = text?.indexOf(highlightedSubstring);

    if (!highlightedSubstring || start === -1) {
      setPreviewText({ prefix: text, middle: '', suffix: '' });
      return;
    }

    const end = start + highlightedSubstring.length - 1;

    setPreviewText({
      prefix: text.substring(0, start),
      middle: text.substring(start, end + 1),
      suffix: text.substring(end + 1),
    });
  }, [text, highlightedSubstring]);

  useEffect(() => {
    processHighlighting();
  }, [processHighlighting]);

  return (
    <div className="relative h-32 w-full bg-neutral-800 md:h-40 lg:h-44">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="whitespace-nowrap text-center text-12 leading-loose text-white">
          {previewText.prefix}
          <Link link={target} className="underline underline-offset-2">
            {previewText.middle}
          </Link>
          {previewText.suffix}
        </p>
      </div>

      <div className="flex size-full items-center justify-end pr-20 xl:pr-48">
        <MarketButton />
      </div>
    </div>
  );
};
export default AnnouncementBar;
