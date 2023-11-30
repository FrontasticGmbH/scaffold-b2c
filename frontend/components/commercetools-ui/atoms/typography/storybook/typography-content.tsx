import React from 'react';
import Typography from '..';

const TypographyContent = () => {
  return (
    <div className="ml-44">
      <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Typography</Typography>
      <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
        The Typography Component consists of pre-defined styles for various text elements. The Typography components can
        be used to create a consistent and visually appealing typography system and includes font size, line height,
        color, and spacing.
      </Typography>
      <div className="mt-52 flex">
        <Typography className="w-200 text-24">This is Regular Font 24px Inter Font Text</Typography>

        <Typography className="ml-20 w-200 text-24 font-medium">This is Medium Font 24px Inter Font Text</Typography>

        <Typography className="ml-20 w-200 text-24 font-medium">
          This is Font 24px Libre Baskerville Font Text
        </Typography>
      </div>
      <div className="mt-40 flex">
        <Typography className="w-200 text-24 leading-tight">This is Tight line height for 24 px Text</Typography>

        <Typography className="ml-20 w-200 text-24 leading-normal">
          This is Normal line height for 24 px Text
        </Typography>

        <Typography className="ml-20 w-200 text-24 leading-loose">This is Loose line height for 24 px Text</Typography>
      </div>
      <div className="mt-40 flex">
        <Typography className="w-200 text-left text-24 leading-tight">
          This is tight left alignment for 24 px Text
        </Typography>

        <Typography className="ml-20 w-200 text-center text-24 leading-normal">
          This is normal center alignment for 24 px Text
        </Typography>

        <Typography className="ml-20 w-200 text-right text-24 leading-loose">
          This is loose right alignment for 24 px Text
        </Typography>
      </div>
    </div>
  );
};

export default TypographyContent;
