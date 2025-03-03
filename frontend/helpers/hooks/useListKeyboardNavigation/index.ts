import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  length: number;
  inlineLength?: number;
  defaultActiveIndex?: number;
  defaultActiveInlineIndex?: number;
  onSelect?: (index: number, inlineIndex: number) => void;
  allow?: (ref: RefObject<HTMLOListElement | HTMLUListElement | null>) => boolean;
}

const useListKeyboardNavigation = ({
  length,
  inlineLength = 0,
  defaultActiveIndex = -1,
  defaultActiveInlineIndex = -1,
  onSelect,
  allow = () => true,
}: Options) => {
  const ref = useRef<HTMLOListElement | HTMLUListElement>(null);

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [activeInlineIndex, setActiveInlineIndex] = useState(defaultActiveInlineIndex);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (allow && !allow(ref)) return;

      if (e.code === 'Enter') {
        e.preventDefault();

        if (0 <= activeIndex && activeIndex < length) {
          onSelect?.(activeIndex, activeInlineIndex);
        }

        return;
      }

      let nextIndex = -1;
      let nextInlineIndex = -1;

      if (e.code === 'ArrowDown') {
        e.preventDefault();
        nextIndex = activeIndex >= length - 1 ? 0 : activeIndex + 1;
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        nextIndex = activeIndex <= 0 ? length - 1 : activeIndex - 1;
      } else if (e.code === 'ArrowLeft') {
        nextInlineIndex = activeInlineIndex <= 0 ? inlineLength - 1 : activeInlineIndex - 1;
      } else if (e.code === 'ArrowRight') {
        nextInlineIndex = activeInlineIndex >= inlineLength - 1 ? 0 : activeInlineIndex + 1;
      }

      if (ref.current && nextIndex !== -1) {
        setActiveIndex(nextIndex);
        ref.current.children.item(nextIndex)?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
      if (ref.current && nextInlineIndex !== -1) {
        setActiveInlineIndex(nextInlineIndex);
        setActiveIndex(0);
        ref.current.children.item(nextInlineIndex)?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }
    },
    [activeIndex, activeInlineIndex, length, inlineLength, onSelect, allow],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetIndices = useCallback(() => {
    setActiveIndex(defaultActiveIndex);
    setActiveInlineIndex(defaultActiveInlineIndex);
  }, [defaultActiveIndex, defaultActiveInlineIndex]);

  return { ref, activeIndex, activeInlineIndex, resetIndices };
};

export default useListKeyboardNavigation;
