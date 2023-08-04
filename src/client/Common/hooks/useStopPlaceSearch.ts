/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getStopPlacesFromAPI } from '@/client/Common/service/stopPlaceSearch';
import { useCallback, useMemo, useRef, useState } from 'react';
import debounce from 'debounce-promise';
import type { ControllerStateAndHelpers } from 'downshift';
import type { MinimalStopPlace } from '@/types/stopPlace';

const debouncedStopPlacesFromAPI = debounce(getStopPlacesFromAPI, 200);

interface UseStationSearchOptions {
  maxSuggestions: number;
  filterForIris?: boolean;
  groupedBySales?: boolean;
}

const itemToString = (s: MinimalStopPlace | null) => (s ? s.name : '');

export const useStopPlaceSearch = ({
  filterForIris,
  maxSuggestions,
  groupedBySales,
}: UseStationSearchOptions) => {
  const [suggestions, setSuggestions] = useState<MinimalStopPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const stopPlaceFn = useMemo(
    () =>
      debouncedStopPlacesFromAPI.bind(
        undefined,
        filterForIris,
        maxSuggestions,
        groupedBySales,
      ),
    [filterForIris, groupedBySales, maxSuggestions],
  );

  const loadOptions = useCallback(
    async (value: string) => {
      setLoading(true);

      const currentSuggestions = await stopPlaceFn(value);

      setSuggestions(currentSuggestions);
      setLoading(false);
    },
    [stopPlaceFn],
  );
  const selectRef = useRef<ControllerStateAndHelpers<MinimalStopPlace>>();

  return {
    loadOptions,
    suggestions,
    setSuggestions,
    loading,
    itemToString,
    selectRef,
  };
};
