import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Popover } from '@headlessui/react';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import { useFormat } from 'helpers/hooks/useFormat';
import useI18n from 'helpers/hooks/useI18n';
import { FacetProps } from './types';
import { useProductList } from '../../context';
import { refinementRemovedEventName, refinementsClearedEventName } from '../../context/constants';
import { RefinementRemovedEvent } from '../../context/types';
import { RangeFacet as RangeFacetType } from '../../types';

const RangeFacet: React.FC<FacetProps> = ({ attribute }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { locale } = useParams();

  const { pricesConfiguration, facetsConfiguration, refineRange } = useProductList();

  const refine = useCallback((value: [number, number]) => refineRange(attribute, value), [attribute, refineRange]);

  const { currency, currencySymbol } = useI18n();

  const configuration = useMemo(() => pricesConfiguration[attribute], [pricesConfiguration, attribute]);

  const facet = useMemo(() => facetsConfiguration[attribute] as RangeFacetType, [facetsConfiguration, attribute]);

  const [appliedOptions, setAppliedOptions] = useState<Array<number>>([]);

  const [priceRange, setPriceRange] = useState({
    min: (facet?.minSelected ?? -Infinity) / 100,
    max: (facet?.maxSelected ?? Infinity) / 100,
  });

  const applyRefinement = useCallback(
    (appliedRange: typeof priceRange) => {
      const min = Math.max(0, appliedRange.min);

      const max = Math.min(appliedRange.max, facet.max);

      if (max === min) {
        refine([min, max + 1]);
      } else {
        refine([min, max]);
      }
    },
    [refine, facet],
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
    let min = -Infinity;
    let max = Infinity;

    if (facet?.minSelected) min = facet.minSelected / 100;
    if (facet?.maxSelected) max = facet.maxSelected / 100;

    setPriceRange({ min, max });
  }, [facet?.minSelected, facet?.maxSelected]);

  useEffect(() => {
    if (!facet?.maxSelected) return clearAppliedOptions();

    const applicable = [] as number[];

    (configuration?.ranges ?? []).forEach((range, index) => {
      if (range.min * 100 <= ((facet.minSelected as number) ?? 0) && range.max * 100 >= (facet.maxSelected as number))
        applicable.push(index);
    });

    setAppliedOptions(applicable);
  }, [facet?.minSelected, facet?.maxSelected, configuration?.ranges, clearAppliedOptions]);

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

    const ranges = configuration.ranges;

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
  }, [configuration, handleRangeOptionChange, currency, appliedOptions, locale]);

  return (
    <div>
      <div className="flex flex-col gap-44">{rangeOptions.Component}</div>
      <div className={rangeOptions.available ? 'mt-48' : ''}>
        <p className="text-16 font-medium">
          {formatProductMessage({ id: 'price.range.custom', defaultMessage: 'Custom price range' })}
        </p>
      </div>
      <form id="range-form" className="mt-36 flex items-center gap-16" onSubmit={handleRangeSubmit}>
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

        <div className="w-16 border border-secondary-black" />

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

        <Popover.Button
          type="submit"
          className="rounded-sm bg-primary-black px-14 py-8 font-medium leading-[24px] text-white transition hover:bg-gray-500"
          form="range-form"
        >
          {formatProductMessage({ id: 'go', defaultMessage: 'Go' })}
        </Popover.Button>
      </form>
    </div>
  );
};

export default RangeFacet;
