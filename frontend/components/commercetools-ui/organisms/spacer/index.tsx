import React, { useId } from 'react';
import * as screensizes from 'helpers/utils/screensizes';

export interface Props {
  backgroundColor: 'white' | 'neutral-200';
  customMobile: number;
  customTablet: number;
  customDesktop: number;
}

const Spacer: React.FC<Props> = ({ customMobile, customTablet, customDesktop, backgroundColor = 'white' }) => {
  const id = useId().replace(/:/g, '');

  return (
    <>
      <style>
        {`
          #${id} {
            height: ${customMobile}px;

            @media screen and (min-width: ${screensizes.tablet}px) {
              height: ${customTablet}px;
            }

            @media screen and (min-width: ${screensizes.desktop}px) {
              height: ${customDesktop}px;
            }
          }
        `}
      </style>

      <div id={id} className={backgroundColor === 'white' ? 'bg-white' : 'bg-neutral-200'}></div>
    </>
  );
};

export default Spacer;
