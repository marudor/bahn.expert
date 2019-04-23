import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import {
  Redirect,
  RouteComponentProps,
  StaticRouterContext,
} from 'react-router';
import { sortedFavValues } from 'Abfahrten/selector/fav';
import { Station } from 'types/station';
import { withRouter } from 'react-router-dom';
import Actions, { AbfahrtenError } from 'Abfahrten/actions/abfahrten';
import FavEntry, { styles as FavEntryStyles } from './FavEntry';
import MostUsed from './MostUsed';
import React from 'react';

type DispatchProps = {
  setCurrentStation: typeof Actions.setCurrentStation;
};
type StateProps = {
  favs: Station[];
  error?: AbfahrtenError;
};
type ReduxProps = DispatchProps & StateProps & RouteComponentProps;

type Props = ReduxProps & WithStyles<typeof styles>;

function getErrorText(
  error: AbfahrtenError,
  staticContext?: StaticRouterContext
): React.ReactNode {
  switch (error.type) {
    case 'redirect':
      return <Redirect to={error.redirect} />;
    case '404':
      if (staticContext) {
        staticContext.status = 404;
      }

      return 'Die Abfahrt existiert nicht';
    default:
      if (error.code === 'ECONNABORTED') {
        return 'Timeout - bitte erneut versuchen';
      }
      if (error && error.response) {
        return getErrorText(error.response.data.error, staticContext);
      }

      return 'Unbekannter Fehler';
  }
}

class FavList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.setCurrentStation();
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

const styles = createStyles({
  main: {
    marginTop: 48,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  favEntry: FavEntryStyles.main,
});

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    favs: sortedFavValues(state),
    error: state.abfahrten.error,
  }),
  {
    setCurrentStation: Actions.setCurrentStation,
  }
)(withRouter(withStyles(styles)(FavList)));
