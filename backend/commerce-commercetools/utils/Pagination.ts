export const getOffsetFromCursor = (cursor: string) => {
  if (cursor === undefined) {
    return undefined;
  }

  const offsetMach = cursor.match(/(?<=offset:).+/);
  return offsetMach !== null ? +Object.values(offsetMach)[0] : undefined;
};
