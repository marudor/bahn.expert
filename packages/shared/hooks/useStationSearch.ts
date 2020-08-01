import { AllowedHafasProfile } from 'types/HAFAS';
import {
  getHafasStationFromAPI,
  getHafasStationFromCoordinates,
  getStationsFromAPI,
  getStationsFromCoordinates,
} from 'shared/service/stationSearch';
import { useCallback, useRef, useState } from 'react';
import debounce from 'debounce-promise';
import type { ControllerStateAndHelpers } from 'downshift';
import type { Station, StationSearchType } from 'types/station';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);
const debouncedHafasStationFromAPI = debounce(getHafasStationFromAPI, 500);

interface UseStationSearchOptions {
  profile?: AllowedHafasProfile;
  searchType?: StationSearchType;
  maxSuggestions: number;
}

const itemToString = (s: Station | null) => (s ? s.title : '');

export const useStationSearch = ({
  profile,
  searchType,
  maxSuggestions,
}: UseStationSearchOptions) => {
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOptions = useCallback(
    async (value: string | Coordinates) => {
      setLoading(true);

      const stationFn = profile
        ? debouncedHafasStationFromAPI.bind(undefined, profile)
        : debouncedGetStationFromAPI.bind(undefined, searchType);

      const geoFn = profile
        ? getHafasStationFromCoordinates.bind(undefined, profile)
        : getStationsFromCoordinates;

      const searchFn = typeof value === 'string' ? stationFn : geoFn;
      // @ts-ignore this works
      const currentSuggestions = await searchFn(value);

      setSuggestions(currentSuggestions.slice(0, maxSuggestions));
      setLoading(false);
    },
    [maxSuggestions, profile, searchType]
  );
  const selectRef = useRef<ControllerStateAndHelpers<Station>>();

  return {
    loadOptions,
    suggestions,
    setSuggestions,
    loading,
    itemToString,
    selectRef,
  };
};
