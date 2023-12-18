export const flattenTree = <T>(tree: T, field: keyof typeof tree): Array<T> => {
  return [tree, ...((tree[field] ?? []) as Array<T>).map((subtree) => flattenTree(subtree as T, field)).flat()];
};
