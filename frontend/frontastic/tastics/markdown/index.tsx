'use client';

import Markdown, { Props as MarkdownProps } from 'components/commercetools-ui/organisms/markdown';
import useClassNames from 'helpers/hooks/useClassNames';
import { TasticProps } from '../types';

interface Props extends MarkdownProps {
  fullWidth: boolean;
  textAlign: 'center' | 'left' | 'right' | 'justify';
}

const MarkdownTastic = ({ data: { fullWidth = false, textAlign = 'left', ...data } }: TasticProps<Props>) => {
  const classNames = useClassNames([
    'prose px-24 md:px-56 lg:px-84',
    !fullWidth ? 'mx-auto max-w-[90%] box-content' : 'max-w-full',
  ]);

  return (
    <div className={classNames} style={{ textAlign }}>
      <Markdown {...data} />
    </div>
  );
};

export default MarkdownTastic;
