// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { getStationsFromAPI } from 'client/actions/abfahrten';
import ActionHome from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import debounce from 'debounce-promise';
import HeaderButtons from './HeaderButtons';
import Helmet from 'react-helmet-async';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Select from 'react-select/lib/Async';
import Toolbar from '@material-ui/core/Toolbar';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

function getMetaDescription(currentStation) {
  let content = 'Bahnhofs Abfahrten';

  if (currentStation) {
    content += ` ${currentStation.title}`;
  }

  return <meta name="Description" content={content} />;
}

function getTitle(currentStation) {
  let title = 'Bahnhofs Abfahrten';

  if (currentStation) {
    title = `${currentStation.title} - ${title}`;
  }

  return <title>{title}</title>;
}

function getMetaKeywords(currentStation) {
  let keywords = 'Bahnhofs Abfahrten, Bahn, Abfahrten, Bahnhof, Verspätung, Pünktlich';

  if (currentStation) {
    keywords = `${currentStation.title}, ${keywords}`;
  }

  return <meta name="keywords" content={keywords} />;
}

type StateProps = {|
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  searchType?: string,
|};

type OwnProps = {|
  ...ContextRouter,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
|};

const selectStyles = {
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

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

class Header extends React.Component<Props> {
  submit = (station: Station) => {
    if (!station) {
      return;
    }
    this.props.history.push(`/${encodeURIComponent(station.title)}`);
  };
  toRoot = () => this.props.history.push('/');
  getOptionLabel = (station: Station) => station.title;
  getOptionValue = (station: Station) => station.id;
  loadOptions = (term: string) => debouncedGetStationFromAPI(term, this.props.searchType);
  render() {
    const { currentStation } = this.props;

    return (
      <>
        <Helmet>
          {getTitle(currentStation)}
          {getMetaDescription(currentStation)}
          {getMetaKeywords(currentStation)}
        </Helmet>
        <AppBar position="fixed">
          <Toolbar disableGutters>
            <IconButton aria-label="Home" onClick={this.toRoot} color="inherit">
              <ActionHome color="inherit" />
            </IconButton>
            <Select
              aria-label="Suche nach Bahnhof"
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
  connect<AppState, Function, OwnProps, StateProps>(state => ({
    currentStation: state.abfahrten.currentStation,
    searchType: state.config.config.searchType,
  }))(Header)
);
