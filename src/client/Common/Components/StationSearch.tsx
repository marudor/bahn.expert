import { getStationsFromAPI } from 'Common/service/stationSearch';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import { StylesConfig } from 'react-select/lib/styles';
import debounce from 'debounce-promise';
import React from 'react';
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
    background: state.isFocused ? 'lightgrey' : 'white',
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
class StationSearch extends React.PureComponent<Props> {
  getOptionLabel = (station: Station) => station.title;
  getOptionValue = (station: Station) => station.id;
  loadOptions = (term: string) =>
    debouncedGetStationFromAPI(term, this.props.searchType);
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
        onChange={onChange as any}
      />
    );
  }
}

export default StationSearch;
