import { useCallback, useMemo } from 'react';

// Hook can take an array of either simple strings or conditioned classnames
// example: ['firstClassName', {'secondClassName': BooleanToCheck}]
// Only if Boolean is true in the example above the className will be added
type ClassName = string | undefined | null | boolean | { [key: string]: boolean };

// Should be extended with any further options
type UseClassNamesOptions = { prefix?: string };
type UseClassNames = (classNames: ClassName[], options?: UseClassNamesOptions) => string;

const useClassNames: UseClassNames = (classNames, options) => {
  const resolveClassNameOptions = useCallback(
    (className: string) => {
      return `${options?.prefix ?? ''}${className}`;
    },
    [options?.prefix],
  );

  const resolveObject = useCallback(
    (className: object) => {
      const classNames = [] as string[];

      Object.keys(className).forEach((key) => {
        if (className[key as keyof typeof className]) classNames.push(resolveClassNameOptions(key));
      });

      return classNames.join(' ');
    },
    [resolveClassNameOptions],
  );

  const resolveClassName = useCallback(
    (className: object | string) => {
      if (typeof className == 'object') {
        return resolveObject(className);
      } else if (className) {
        return resolveClassNameOptions(className);
      }
    },
    [resolveClassNameOptions, resolveObject],
  );

  const resolveClassNames = useCallback(
    (classNames: ClassName[]) => {
      const stringifiedClassNames = [] as ClassName[];

      classNames.filter(Boolean).map((className) => {
        const resolvedClassName: string = resolveClassName(className as string | object) as string;
        stringifiedClassNames.push(resolvedClassName);
      });

      return stringifiedClassNames;
    },
    [resolveClassName],
  );
  const result = useMemo(() => resolveClassNames(classNames).join(' '), [resolveClassNames, classNames]);

  return result;
};

export default useClassNames;
