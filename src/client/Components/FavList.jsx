// @flow
import './FavList.scss';
import { Actions } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { sortedFavValues } from 'client/selector/fav';
import FavEntry from './FavEntry';
import MostUsed from './MostUsed';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type OwnProps = {|
  ...ContextRouter,
|};
type DispatchProps = {|
  setCurrentStation: typeof Actions.setCurrentStation,
|};
type StateProps = {|
  favs: Station[],
  error: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'error'>,
|};
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

function getErrorText(error: any, staticContext) {
  switch (error.type) {
    case 'redirect':
      return <Redirect to={error.redirect} />;
    case '404':
      if (staticContext) {
        // $FlowFixMe
        staticContext.status = 404;
      }

      return 'Die Abfahrt existiert nicht';
    default:
      if (error.code === 'ECONNABORTED') {
        return 'Timeout - bitte erneut versuchen';
      }
      if (error.response?.data?.error) {
        return getErrorText(error.response.data.error, staticContext);
      }

      return 'Unbekannter Fehler';
  }
}

class FavList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.setCurrentStation(null);
  }
  render() {
    const { favs, error, staticContext } = this.props;

    return (
      <main className="FavList">
        {/* eslint-disable-next-line no-nested-ternary */}
        {error ? (
          <>
            <div className="FavEntry">{getErrorText(error, staticContext)}</div>
            {error.station && (
              <Link to={encodeURIComponent(error.station)}>
                <div className="FavEntry">{error.station}</div>
              </Link>
            )}
            <div className="FavEntry">Versuch einen der folgenden</div>
            <MostUsed />
          </>
        ) : favs.length ? (
          favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
        ) : (
          <>
            <span className="FavEntry">Keine Favoriten</span>
            <span className="FavEntry">Oft gesucht:</span>
            <MostUsed />
          </>
        )}
      </main>
    );
  }
}

export default withRouter(
  connect<AppState, Function, OwnProps, StateProps, DispatchProps>(
    state => ({
      favs: sortedFavValues(state),
      error: state.abfahrten.error,
    }),
    {
      setCurrentStation: Actions.setCurrentStation,
    }
  )(FavList)
);
