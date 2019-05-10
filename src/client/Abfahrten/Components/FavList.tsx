import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
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
import FavEntry, { FavEntryDisplay } from './FavEntry';
import MostUsed from './MostUsed';
import React, { useEffect } from 'react';
import useStyles from './FavList.style';

type DispatchProps = ResolveThunks<{
  setCurrentStation: typeof Actions.setCurrentStation;
}>;

type StateProps = {
  favs: Station[];
  error?: AbfahrtenError;
};
type ReduxProps = DispatchProps & StateProps & RouteComponentProps;

type Props = ReduxProps;

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

const FavList = ({ favs, error, staticContext, setCurrentStation }: Props) => {
  const classes = useStyles();

  useEffect(() => {
    setCurrentStation();
  }, [setCurrentStation]);

  return (
    <main className={classes.main}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {error ? (
        <>
          <FavEntryDisplay text={getErrorText(error, staticContext)} />
          {error.station && (
            <Link to={encodeURIComponent(error.station)}>
              <FavEntryDisplay text={error.station} />
            </Link>
          )}
          <FavEntryDisplay text="Versuch einen der folgenden" />
          <MostUsed />
        </>
      ) : favs.length ? (
        favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
      ) : (
        <>
          <FavEntryDisplay text="Keine Favoriten" />
          <FavEntryDisplay text="Oft gesucht:" />
          <MostUsed />
        </>
      )}
    </main>
  );
};

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    favs: sortedFavValues(state),
    error: state.abfahrten.error,
  }),
  {
    setCurrentStation: Actions.setCurrentStation,
  }
)(withRouter(FavList));
