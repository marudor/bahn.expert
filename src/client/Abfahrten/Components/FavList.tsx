import { Link } from 'react-router-dom';
import { Redirect, StaticRouterContext } from 'react-router';
import { Station } from 'types/station';
import AbfahrtenContainer, {
  AbfahrtenError,
} from 'Abfahrten/container/AbfahrtenContainer';
import favContainer from 'Abfahrten/container/FavContainer';
import FavEntry, { FavEntryDisplay } from './FavEntry';
import HeaderTagContainer from 'Common/container/HeaderTagContainer';
import MostUsed from './MostUsed';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import useStyles from './FavList.style';
import Zugsuche from 'Common/Components/Zugsuche';

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

interface Props {
  staticContext?: StaticRouterContext;
  children?: ReactNode;
}

const FavList = ({ staticContext, children }: Props) => {
  const { favs, MostUsedComponent } = favContainer.useContainer();
  const sortedFavs = useMemo(() => {
    const values: Station[] = Object.values(favs);

    return values
      .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
      .map((fav) => <FavEntry key={fav.id} fav={fav} />);
  }, [favs]);
  const { error } = AbfahrtenContainer.useContainer();
  const [savedError] = useState(error);
  const classes = useStyles();
  const { resetTitleAndDescription } = HeaderTagContainer.useContainer();

  useEffect(resetTitleAndDescription, []);

  return (
    <main className={classes.main}>
      {children}
      <Zugsuche />
      {/* eslint-disable-next-line no-nested-ternary */}
      {savedError ? (
        <>
          <FavEntryDisplay
            data-testid="error"
            clickable={false}
            text={getErrorText(savedError, staticContext)}
          />
          {savedError.station && (
            <Link
              data-testid="triedStation"
              to={encodeURIComponent(savedError.station)}
            >
              <FavEntryDisplay text={savedError.station} />
            </Link>
          )}
          <FavEntryDisplay
            clickable={false}
            text="Versuch einen der folgenden"
          />
          <MostUsed />
        </>
      ) : sortedFavs.length ? (
        <>
          <FavEntryDisplay clickable={false} text="Favoriten" />
          {sortedFavs}
        </>
      ) : (
        <>
          <FavEntryDisplay
            clickable={false}
            data-testid="noFav"
            text="Keine Favoriten"
          />
        </>
      )}
      {MostUsedComponent && (
        <>
          <FavEntryDisplay clickable={false} text="Oft Gesucht" />
          <MostUsed />
        </>
      )}
    </main>
  );
};

export default FavList;
