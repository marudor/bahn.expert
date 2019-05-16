import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import AppBar from '@material-ui/core/AppBar';
import ExtraMenu from './ExtraMenu';
import HomeMenu from 'Abfahrten/Components/HomeMenu';
import React from 'react';
import StationSearch from 'Common/Components/StationSearch';
import Toolbar from '@material-ui/core/Toolbar';

type StateProps = {
  currentStation?: Station;
  searchType?: StationSearchType;
  baseUrl: string;
};

type Props = StateProps & RouteComponentProps;

class Header extends React.Component<Props> {
  metaTags = () => {
    const { currentStation, baseUrl } = this.props;

    let title = 'Bahnhofsabfahrten';
    let ogDescription =
      'Zugabfahrten für Stationen der Deutsche Bahn. Nutzt verschiedene Quellen um möglichst genaue Informationen bereitzustellen. Nutzt teilweise offizielle, teilweise inoffizielle Quellen.';
    let description = ogDescription;
    let url = `https://${baseUrl}`;
    const image = `https://${baseUrl}/android-chrome-384x384.png`;

    if (currentStation) {
      title = `${currentStation.title} - ${title}`;
      description = `Zugabfahrten für ${currentStation.title}`;
      ogDescription = description;
      url += `/${encodeURIComponent(currentStation.title)}`;
    }

    return (
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <meta name="description" content={description} />
        {/* Twitter Start */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@marudor" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:creator" content="@marudor" />
        <meta name="twitter:image" content={image} />
        {/* Twitter End */}
        {/* Open Graph Start */}
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content="de_DE" />
        {/* Open Graph End */}
      </Helmet>
    );
  };
  submit = (station: Station) => {
    if (!station) {
      return;
    }
    this.props.history.push(`/${encodeURIComponent(station.title)}`);
  };
  toRoot = () => this.props.history.push('/');
  render() {
    const { currentStation, searchType } = this.props;

    return (
      <>
        {this.metaTags()}
        <AppBar position="fixed">
          <Toolbar disableGutters>
            <HomeMenu />
            <StationSearch
              autoFocus={!currentStation}
              searchType={searchType}
              value={currentStation}
              onChange={this.submit}
              placeholder="Station (z.B. Kiel Hbf)"
            />
            <ExtraMenu />
          </Toolbar>
        </AppBar>
      </>
    );
  }
}

export default connect<StateProps, void, void, AbfahrtenState>(state => ({
  currentStation: state.abfahrten.currentStation,
  searchType: state.abfahrtenConfig.config.searchType,
  baseUrl: state.config.baseUrl,
}))(withRouter(Header));
