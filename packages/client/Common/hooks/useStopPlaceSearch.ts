import {
  getStopPlacesFromAPI,
  getStopPlacesFromCoordinates,
} from 'client/Common/service/stopPlaceSearch';
import { useCallback, useMemo, useRef, useState } from 'react';
import debounce from 'debounce-promise';
import type { ControllerStateAndHelpers } from 'downshift';
import type { MinimalStopPlace } from 'types/stopPlace';

const debouncedStopPlacesFromAPI = debounce(getStopPlacesFromAPI, 500);

interface UseStationSearchOptions {
  maxSuggestions: number;
  filterForIris: boolean;
}

const itemToString = (s: MinimalStopPlace | null) => (s ? s.name : '');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useStopPlaceSearch = ({
  filterForIris,
  maxSuggestions,
}: UseStationSearchOptions) => {
  const [suggestions, setSuggestions] = useState<MinimalStopPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const stopPlaceFn = useMemo(
    () =>
      debouncedStopPlacesFromAPI.bind(undefined, filterForIris, maxSuggestions),
    [filterForIris, maxSuggestions],
  );
  const geoFn = useMemo(
    () =>
      getStopPlacesFromCoordinates.bind(
        undefined,
        filterForIris,
        maxSuggestions,
      ),
    [filterForIris, maxSuggestions],
  );

  const loadOptions = useCallback(
    async (value: string | GeolocationCoordinates) => {
      setLoading(true);

      const currentSuggestions = await (typeof value === 'string'
        ? stopPlaceFn(value)
        : geoFn(value));

      setSuggestions(currentSuggestions);
      setLoading(false);
    },
    [geoFn, stopPlaceFn],
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
