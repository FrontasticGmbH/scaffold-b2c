import React, { useMemo } from 'react';

export type SubtitleProps = {
  subtitle: string;
  className?: string;
  variant?: 'sm' | 'lg';
};

const Subtitle: React.FC<SubtitleProps> = ({ subtitle, className = '', variant = 'lg' }) => {
  const fontClassName = useMemo(() => {
    switch (variant) {
      case 'sm':
        return 'text-12 md:text-12 lg:text-14';
      case 'lg':
        return 'text-14 md:text-14 lg:text-16';
      default:
        return '';
    }
  }, [variant]);

  return <p className={`${className} ${fontClassName} font-thin leading-loose`}>{subtitle}</p>;
};

export default Subtitle;
