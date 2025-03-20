import { FC } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';

type FeedbackProps = {
  error: string;
  success: string;
};

const Feedback: FC<FeedbackProps> = ({ error, success }) => {
  const feedBackElementClassName = useClassNames(['mb-12 text-12', success ? 'text-green-600' : 'text-red-500']);

  if (!error && !success) return <></>;

  return <p className={feedBackElementClassName}>{error || success}</p>;
};

export default Feedback;
