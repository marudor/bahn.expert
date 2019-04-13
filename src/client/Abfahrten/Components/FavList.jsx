// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { sortedFavValues } from 'Abfahrten/selector/fav';
import Actions from 'Abfahrten/actions/abfahrten';
import FavEntry, { styles as FavEntryStyles } from './FavEntry';
import MostUsed from './MostUsed';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState } from 'AppState';
import type { Station } from 'types/station';

type OwnProps = {||};
type DispatchProps = {|
  +setCurrentStation: typeof Actions.setCurrentStation,
|};
type StateProps = {|
  +favs: Station[],
  +error: ?$PropertyType<$PropertyType<AbfahrtenState, 'abfahrten'>, 'error'>,
|};
type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};
type RouterProps = {|
  ...ReduxProps,
  ...ContextRouter,
|};

type Props = StyledProps<RouterProps, typeof styles>;

function getErrorText(error, staticContext) {
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
      if (error) {
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
    const { favs, error, staticContext, classes } = this.props;

    return (
      <main className={classes.main}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {error ? (
          <>
            <div className={classes.favEntry}>
              {getErrorText(error, staticContext)}
            </div>
            {error.station && (
              <Link to={encodeURIComponent(error.station)}>
                <div className={classes.favEntry}>{error.station}</div>
              </Link>
            )}
            <div className={classes.favEntry}>Versuch einen der folgenden</div>
            <MostUsed />
          </>
        ) : favs.length ? (
          favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
        ) : (
          <>
            <span className={classes.favEntry}>Keine Favoriten</span>
            <span className={classes.favEntry}>Oft gesucht:</span>
            <MostUsed />
          </>
        )}
      </main>
    );
  }
}

const styles = {
  main: {
    marginTop: 64,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  favEntry: FavEntryStyles.main,
};

export default connect<
  ReduxProps,
  OwnProps,
  StateProps,
  DispatchProps,
  AbfahrtenState,
  _
>(
  state => ({
    favs: sortedFavValues(state),
    error: state.abfahrten.error,
  }),
  {
    setCurrentStation: Actions.setCurrentStation,
  }
)(withRouter(withStyles(styles)(FavList)));
