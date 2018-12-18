// @flow
import { Actions, getStationsFromAPI } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet-async';
import ActionHome from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import debounce from 'debounce-promise';
import HeaderButtons from './HeaderButtons';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Select from 'react-select/lib/Async';
import Toolbar from '@material-ui/core/Toolbar';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type StateProps = {|
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  searchType?: string,
|};

type DispatchProps = {|
  setCurrentStation: typeof Actions.setCurrentStation,
|};

type OwnProps = {|
  ...ContextRouter,
|};

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
|};

const selectStyles = {
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

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

class Header extends React.Component<Props> {
  submit = (station: Station) => {
    if (!station) {
      return;
    }
    const { setCurrentStation } = this.props;

    setCurrentStation(station);
    this.props.history.push(`/${encodeURIComponent(station.title)}`);
  };
  toRoot = () => this.props.history.push('/');
  filterOption(option: any) {
    return option;
  }
  getOptionLabel = (station: Station) => station.title;
  getOptionValue = (station: Station) => station.id;
  loadOptions = (term: string) => debouncedGetStationFromAPI(term, this.props.searchType);
  render() {
    const { currentStation } = this.props;

    let title = 'Bahnhofs Abfahrten';

    if (currentStation) {
      title = `${currentStation.title} - ${title}`;
    }

    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton onClick={this.toRoot} color="inherit">
              <ActionHome color="inherit" />
            </IconButton>
            <Select
              styles={selectStyles}
              loadOptions={this.loadOptions}
              getOptionLabel={this.getOptionLabel}
              getOptionValue={this.getOptionValue}
              placeholder="Bahnhof (z.B. Hamburg Hbf)"
              value={currentStation}
              onChange={this.submit}
            />
            <HeaderButtons />
          </Toolbar>
        </AppBar>
      </>
    );
  }
}

export default withRouter(
  connect<AppState, Function, OwnProps, StateProps, DispatchProps>(
    state => ({
      currentStation: state.abfahrten.currentStation,
      searchType: state.config.searchType,
    }),
    {
      setCurrentStation: Actions.setCurrentStation,
    }
  )(Header)
);
