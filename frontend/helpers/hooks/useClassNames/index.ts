import { classnames } from 'helpers/utils/classnames';

const useClassNames = (classNames: Parameters<typeof classnames>) => {
  return classnames(...classNames);
};

export default useClassNames;
