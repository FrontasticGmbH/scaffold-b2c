import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useHits, useRange } from 'react-instantsearch';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import { FacetProps } from './types';
import { useProductList } from '../../context';
import { refinementRemovedEventName, refinementsClearedEventName } from '../../context/constants';
import { RefinementRemovedEvent } from '../../context/types';

const RangeFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { locale } = useParams();

  const { pricesConfiguration, updateNumericRange } = useProductList();

  const { results } = useHits();

  const disjunctiveFacet = useMemo(
    () => results?.disjunctiveFacets.find((facet) => facet.name === attribute),
    [attribute, results],
  );

  const { range, refine, start } = useRange({ attribute });

  const { currency, currencySymbol } = useI18n();

  const configuration = useMemo(() => pricesConfiguration[attribute], [pricesConfiguration, attribute]);

  const [appliedOptions, setAppliedOptions] = useState<Array<number>>([]);

  const [priceRange, setPriceRange] = useState({ min: -Infinity, max: Infinity });

  useEffect(() => {
    setPriceRange((priceRange) => {
      const min = start[0] && start[0] !== -Infinity ? start[0] / 100 : priceRange.min;
      const max = start[1] && start[1] !== Infinity ? start[1] / 100 : priceRange.max;

      return { min, max };
    });
  }, [start]);

  useEffect(() => {
    if (range.min && range.max) updateNumericRange(attribute, [range.min, range.max]);
  }, [range.min, range.max, updateNumericRange, attribute]);

  const applyRefinement = useCallback(
    (appliedRange: typeof priceRange) => {
      const min = Math.max(range.min as number, appliedRange.min);
      const max = Math.min(range.max as number, appliedRange.max);

      refine([min, max]);
    },
    [range, refine],
  );

  const handleRangeOptionChange = useCallback(
    (index: number, checked: boolean) => {
      const newAppliedOptions = checked
        ? [...appliedOptions, index]
        : appliedOptions.filter((option) => option !== index);

      const appliedRanges = newAppliedOptions.map((index) => configuration.ranges[index]);

      const appliedRange =
        appliedRanges.length > 0
          ? appliedRanges.reduce(
              (acc, { min, max }) => ({
                min: Math.min(min, acc.min),
                max: Math.max(max, acc.max),
              }),
              { min: Infinity, max: -Infinity },
            )
          : { min: -Infinity, max: Infinity };

      applyRefinement({ min: appliedRange.min * 100, max: appliedRange.max * 100 });

      setAppliedOptions(newAppliedOptions);

      setPriceRange({ ...appliedRange });
    },
    [appliedOptions, configuration, applyRefinement],
  );

  const clearAppliedOptions = useCallback(() => {
    setAppliedOptions([]);
  }, []);

  useEffect(() => {
    clearAppliedOptions();
  }, [range.min, range.max, clearAppliedOptions]);

  const reset = useCallback(() => {
    clearAppliedOptions();
    setPriceRange({ min: -Infinity, max: Infinity });
  }, [clearAppliedOptions]);

  const handleRefinementRemoved = useCallback(
    (e: CustomEvent<RefinementRemovedEvent>) => {
      if (e.detail.attribute === attribute) reset();
    },
    [reset, attribute],
  );

  useEffect(() => {
    window.addEventListener(refinementRemovedEventName, handleRefinementRemoved as EventListener);
    window.addEventListener(refinementsClearedEventName, reset);

    return () => {
      window.removeEventListener(refinementRemovedEventName, handleRefinementRemoved as EventListener);
      window.removeEventListener(refinementsClearedEventName, reset);
    };
  }, [reset, handleRefinementRemoved]);

  const handleRangeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPriceRange({ ...priceRange, [e.target.name]: +e.target.value });
    },
    [priceRange],
  );

  const handleRangeSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      applyRefinement({ min: priceRange.min * 100, max: priceRange.max * 100 });

      clearAppliedOptions();
    },
    [priceRange, clearAppliedOptions, applyRefinement],
  );

  const rangeOptions = useMemo(() => {
    if (!configuration) return { available: false, Component: <></> };

    const ranges = configuration.ranges
      .map((range) => {
        if (!disjunctiveFacet) return range;

        const refinements = Object.entries(disjunctiveFacet.data).reduce(
          (acc, [centAmount, count]: [string, number]) =>
            acc + (+centAmount >= range.min * 100 && +centAmount < range.max * 100 ? count : 0),
          0,
        );

        return { ...range, refinements };
      })
      .filter(({ refinements }) => refinements && refinements > 0);

    return {
      available: ranges.length > 0,
      Component: ranges.map(({ min, max, refinements }, index) => (
        <div key={index} className="flex items-center justify-between gap-8">
          <div>
            {CurrencyHelpers.formatForCurrency(min * 100, locale, currency)} -{' '}
            {CurrencyHelpers.formatForCurrency(max * 100, locale, currency)}
          </div>
          <div className="flex items-center gap-12">
            <Checkbox
              checked={appliedOptions.includes(index)}
              onChange={({ checked }) => handleRangeOptionChange(index, checked)}
              label={refinements?.toString()}
              labelPosition="on-left"
            />
          </div>
        </div>
      )),
    };
  }, [configuration, handleRangeOptionChange, currency, disjunctiveFacet, appliedOptions, locale]);

  return (
    <div>
      <div className="flex flex-col gap-44">{rangeOptions.Component}</div>
      <div className={rangeOptions.available ? 'mt-48' : ''}>
        <p className="text-16 font-medium">
          {formatProductMessage({ id: 'price.range.custom', defaultMessage: 'Custom price range' })}
        </p>
      </div>
      <form className="mt-36 flex items-center gap-16" onSubmit={handleRangeSubmit}>
        <label
          htmlFor="min"
          className="flex w-85 items-center gap-4 border border-neutral-500 bg-white p-7"
          aria-label="min"
        >
          <input
            id="min"
            name="min"
            className="w-full border-none p-0 outline-none focus:border-none focus:outline-none"
            type="number"
            value={priceRange.min !== -Infinity ? priceRange.min.toString() : ''}
            placeholder={formatProductMessage({ id: 'min', defaultMessage: 'Min' })}
            onChange={handleRangeInputChange}
          />
          <span>{currencySymbol}</span>
        </label>

        <div className="w-16 border border-gray-600" />

        <label
          htmlFor="max"
          className="flex w-85 items-center gap-4 border border-neutral-500 bg-white p-7"
          aria-label="max"
        >
          <input
            id="max"
            name="max"
            className="w-full border-none p-0 outline-none focus:border-none focus:outline-none"
            type="number"
            value={priceRange.max !== Infinity ? priceRange.max.toString() : ''}
            placeholder={formatProductMessage({ id: 'max', defaultMessage: 'Max' })}
            onChange={handleRangeInputChange}
          />
          <span>{currencySymbol}</span>
        </label>

        <button
          type="submit"
          className="rounded-sm bg-primary px-14 py-8 font-medium leading-[24px] text-white transition hover:bg-gray-500"
        >
          {formatProductMessage({ id: 'go', defaultMessage: 'Go' })}
        </button>
      </form>
    </div>
  );
};

export default RangeFacet;
