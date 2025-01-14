import { renderHook } from '__test__/utils';
import useSelectedColorFilterVariantIndex from '.';
import { useProductList } from '../../../components/commercetools-ui/organisms/product/product-list/context';

jest.mock('../../../components/commercetools-ui/organisms/product/product-list/context', () => ({
  useProductList: jest.fn(),
}));

describe('useSelectedColorFilterVariant', () => {
  it('should return undefined if variant is not found', () => {
    (useProductList as jest.Mock).mockReturnValueOnce({
      activeRefinements: [{ label: 'pink' }],
    });

    const { result } = renderHook(() => useSelectedColorFilterVariantIndex([]));
    expect(result.current).toBe(undefined);
  });

  it('should return index if variant is found', () => {
    (useProductList as jest.Mock).mockReturnValueOnce({
      activeRefinements: [{ label: 'red' }, { label: 'blue' }],
    });

    const { result } = renderHook(() => useSelectedColorFilterVariantIndex([{ attributes: { colorlabel: 'blue' } }]));
    expect(result.current).toBe(0);
  });
});
