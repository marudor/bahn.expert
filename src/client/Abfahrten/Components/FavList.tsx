import { Link } from 'react-router-dom';
import { Redirect, StaticRouterContext } from 'react-router';
import { useAbfahrtenSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import { useRouter } from 'useRouter';
import Actions, { AbfahrtenError } from 'Abfahrten/actions/abfahrten';
import favContainer from 'Abfahrten/container/FavContainer';
import FavEntry, { FavEntryDisplay } from './FavEntry';
import MostUsed from './MostUsed';
import React, { useEffect, useMemo } from 'react';
import useStyles from './FavList.style';

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
      if (error && error.response && error.response.data.error) {
        return getErrorText(error.response.data.error, staticContext);
      }

      return 'Unbekannter Fehler';
  }
}

const FavList = () => {
  const { favs } = favContainer.useContainer();
  const sortedFavs = useMemo(() => {
    const values = Object.values(favs);

    return values
      .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
      .map(fav => fav && <FavEntry key={fav.id} fav={fav} />);
  }, [favs]);
  const error = useAbfahrtenSelector(state => state.abfahrten.error);
  const { staticContext } = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(Actions.setCurrentStation());
  }, [dispatch]);

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
      ) : sortedFavs.length ? (
        sortedFavs
      ) : (
        <>
          <FavEntryDisplay data-testid="noFav" text="Keine Favoriten" />
          <FavEntryDisplay text="Oft gesucht:" />
          <MostUsed />
        </>
      )}
    </main>
  );
};

export default FavList;
