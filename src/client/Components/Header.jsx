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

function metaTags(currentStation: ?Station, baseUrl: string) {
  let keywords = 'Bahnhofs Abfahrten, Bahn, Abfahrten, Bahnhof, Verspätung, Pünktlich';
  let title = 'Bahnhofs Abfahrten';
  let description = 'Bahnhofs Abfahrten';

  if (currentStation) {
    title = `${currentStation.title} - ${title}`;
    description = `Zugabfahrten für ${currentStation.title}`;
    keywords = `${currentStation.title}, ${keywords}`;
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/* Twitter Start */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@marudor" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@marudor" />
      {/* Twitter End */}
      {/* Open Graph Start */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}/android-chrome-384x384.png`} />
      {/* Open Graph End */}
    </>
  );
}

type StateProps = {|
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  searchType?: string,
  baseUrl: string,
|};

type OwnProps = {|
  ...ContextRouter,
|};

type Props = {|
  ...StateProps,
  ...OwnProps,
|};

const selectStyles = {
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
    const { currentStation, baseUrl } = this.props;

    return (
      <>
        <Helmet>{metaTags(currentStation, baseUrl)}</Helmet>
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
    baseUrl: state.config.baseUrl,
  }))(Header)
);
