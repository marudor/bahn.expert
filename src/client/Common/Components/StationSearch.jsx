// @flow
import { getStationsFromAPI } from 'Common/service/stationSearch';
import debounce from 'debounce-promise';
import React from 'react';
import Select from 'react-select/lib/Async';
import type { Station } from 'types/station';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

const selectStyles = {
  dropdownIndicator: () => ({
    display: 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  placeholder: (base: Object) => ({
    ...base,
    color: 'hsl(0, 0%, 45%)',
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? 'lightgrey' : 'white',
    color: 'black',
  }),
  container: () => ({
    flex: 1,
    position: 'relative',
  }),
};

type OwnProps = {|
  searchType?: StationSearchType,
  value: ?Station,
  onChange: Station => any,
  autoFocus?: boolean,
  placeholder?: string,
|};
type Props = OwnProps;
class StationSearch extends React.PureComponent<Props> {
  getOptionLabel = (station: Station) => station.title;
  getOptionValue = (station: Station) => station.id;
  loadOptions = (term: string) => debouncedGetStationFromAPI(term, this.props.searchType);
  render() {
    const { onChange, value, autoFocus, placeholder } = this.props;

    return (
      <Select
        autoFocus={autoFocus}
        aria-label="Suche nach Bahnhof"
        styles={selectStyles}
        loadOptions={this.loadOptions}
        getOptionLabel={this.getOptionLabel}
        getOptionValue={this.getOptionValue}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default StationSearch;
