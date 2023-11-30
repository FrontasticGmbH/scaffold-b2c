type ClassToken = string | null | undefined | Record<string, boolean | null | undefined>;

export const classnames = (...tokens: ClassToken[]) => {
  const resolvedTokens = tokens.reduce((acc, curr) => {
    if (!curr) return acc;

    if (typeof curr === 'string') return [...acc, curr.trim()];

    return [
      ...acc,
      Object.entries(curr)
        .reduce((acc, [key, val]) => {
          if (val) return [...acc, key.trim()];
          return acc;
        }, [] as string[])
        .join(' '),
    ];
  }, [] as string[]);

  return resolvedTokens.join(' ');
};
