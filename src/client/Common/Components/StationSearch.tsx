import { getStationsFromAPI } from 'Common/service/stationSearch';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import { StylesConfig } from 'react-select/lib/styles';
import debounce from 'debounce-promise';
import React, { useCallback } from 'react';
import Select from 'react-select/lib/Async';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

const selectStyles: StylesConfig = {
  dropdownIndicator: () => ({
    display: 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  placeholder: base => ({
    ...base,
    color: 'hsl(0, 0%, 45%)',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? 'lightgray' : 'white',
    color: 'black',
  }),
  container: () => ({
    flex: 1,
    position: 'relative',
  }),
};

type OwnProps = {
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
};
type Props = OwnProps;

const StationSearch = ({
  onChange,
  value,
  autoFocus,
  placeholder,
  searchType,
}: Props) => {
  const loadOptions = useCallback(
    (term: string) => debouncedGetStationFromAPI(term, searchType),
    [searchType]
  );
  const getOptionLabel = useCallback((station: Station) => station.title, []);
  const getOptionValue = useCallback((station: Station) => station.id, []);

  return (
    <Select
      autoFocus={autoFocus}
      aria-label="Suche nach Bahnhof"
      styles={selectStyles}
      loadOptions={loadOptions}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      placeholder={placeholder}
      value={value || null}
      onChange={onChange as any}
    />
  );
};

export default StationSearch;
