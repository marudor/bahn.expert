import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
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
import React, { useEffect } from 'react';

type DispatchProps = ResolveThunks<{
  setCurrentStation: typeof Actions.setCurrentStation;
}>;

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

const FavList = ({
  favs,
  error,
  staticContext,
  classes,
  setCurrentStation,
}: Props) => {
  useEffect(() => {
    setCurrentStation();
  }, [setCurrentStation]);

  return (
    <main className={classes.main}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {error ? (
        <>
          <Paper square className={classes.favEntry}>
            {getErrorText(error, staticContext)}
          </Paper>
          {error.station && (
            <Link to={encodeURIComponent(error.station)}>
              <Paper square className={classes.favEntry}>
                {error.station}
              </Paper>
            </Link>
          )}
          <Paper square className={classes.favEntry}>
            Versuch einen der folgenden
          </Paper>
          <MostUsed />
        </>
      ) : favs.length ? (
        favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
      ) : (
        <>
          <Paper square className={classes.favEntry}>
            Keine Favoriten
          </Paper>
          <Paper square className={classes.favEntry}>
            Oft gesucht:
          </Paper>
          <MostUsed />
        </>
      )}
    </main>
  );
};

const styles = createStyles(theme => ({
  main: {
    marginTop: theme.shape.headerSpacing,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  favEntry: FavEntryStyles(theme).main,
}));

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    favs: sortedFavValues(state),
    error: state.abfahrten.error,
  }),
  {
    setCurrentStation: Actions.setCurrentStation,
  }
)(withRouter(withStyles(styles)(FavList)));
