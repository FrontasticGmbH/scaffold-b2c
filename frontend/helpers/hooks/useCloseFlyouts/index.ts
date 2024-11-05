import { useCallback } from 'react';

const useCloseFlyouts = () => {
  const closeFlyouts = useCallback(() => {
    //Trigger an `ESC` key click to close any active flyouts
    const event = new Event('keyup') as KeyboardEvent;
    (event.key as string) = 'Escape';
    document.dispatchEvent(event);
  }, []);

  return closeFlyouts;
};

export default useCloseFlyouts;
