import { flattenTree } from './';

describe('flattenTree', () => {
  it('should flatten a tree with no children', () => {
    const tree = { id: 1, children: [] };
    const result = flattenTree(tree, 'children');
    expect(result).toEqual([tree]);
  });

  it('should flatten a tree with one level of children', () => {
    const tree = {
      id: 1,
      children: [
        { id: 2, children: [] },
        { id: 3, children: [] },
      ],
    };

    const result = flattenTree(tree, 'children');
    expect(result).toEqual([
      {
        id: 1,
        children: [
          { id: 2, children: [] },
          { id: 3, children: [] },
        ],
      },
      { id: 2, children: [] },
      { id: 3, children: [] },
    ]);
  });

  it('should flatten a tree with multiple nested levels', () => {
    const tree = {
      id: 1,
      children: [
        {
          id: 2,
          children: [{ id: 4, children: [] }],
        },
        { id: 3, children: [] },
      ],
    };

    const result = flattenTree(tree, 'children');
    expect(result).toEqual([
      {
        id: 1,
        children: [
          { id: 2, children: [{ id: 4, children: [] }] },
          { id: 3, children: [] },
        ],
      },
      { id: 2, children: [{ id: 4, children: [] }] },
      { id: 4, children: [] },
      { id: 3, children: [] },
    ]);
  });

  it('should handle a tree where field is null or undefined', () => {
    const tree = { id: 1, children: null };
    const result = flattenTree(tree, 'children');
    expect(result).toEqual([tree]);
  });

  it('should work with a custom field name', () => {
    const tree = {
      id: 1,
      nodes: [
        { id: 2, nodes: [{ id: 4, nodes: [] }] },
        { id: 3, nodes: [] },
      ],
    };

    const result = flattenTree(tree, 'nodes');
    expect(result).toEqual([
      {
        id: 1,
        nodes: [
          { id: 2, nodes: [{ id: 4, nodes: [] }] },
          { id: 3, nodes: [] },
        ],
      },
      { id: 2, nodes: [{ id: 4, nodes: [] }] },
      { id: 4, nodes: [] },
      { id: 3, nodes: [] },
    ]);
  });
});
