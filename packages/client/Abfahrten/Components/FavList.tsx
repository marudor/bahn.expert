import {
  AbfahrtenContainer,
  AbfahrtenError,
} from 'client/Abfahrten/container/AbfahrtenContainer';
import { FavContainer } from 'client/Abfahrten/container/FavContainer';
import { FavEntry, FavEntryDisplay } from './FavEntry';
import { HeaderTagContainer } from 'client/Common/container/HeaderTagContainer';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { MostUsed } from './MostUsed';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Redirect, StaticRouterContext } from 'react-router';
import { Zugsuche } from 'client/Common/Components/Zugsuche';
import type { Station } from 'types/station';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

function getErrorText(
  error: AbfahrtenError,
  staticContext?: StaticRouterContext
): React.ReactNode {
  switch (error.errorType) {
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

      return 'Unbekannter Fehler';
  }
}

interface Props {
  staticContext?: StaticRouterContext;
  children?: ReactNode;
}

export const FavList = ({ staticContext, children }: Props) => {
  const classes = useStyles();
  const { favs, MostUsedComponent } = FavContainer.useContainer();
  const sortedFavs = useMemo(() => {
    const values: Station[] = Object.values(favs);

    return values
      .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
      .map((fav) => <FavEntry key={fav.id} fav={fav} />);
  }, [favs]);
  const { error } = AbfahrtenContainer.useContainer();
  const [savedError] = useState(error);
  const { resetTitleAndDescription } = HeaderTagContainer.useContainer();

  useEffect(resetTitleAndDescription, [resetTitleAndDescription]);

  return (
    <main className={classes.wrap}>
      {children}
      <Zugsuche />
      {/* eslint-disable-next-line no-nested-ternary */}
      {savedError && (
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
        </>
      )}
      {sortedFavs.length ? (
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
