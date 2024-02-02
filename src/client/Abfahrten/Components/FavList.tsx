import { FavEntry, FavEntryDisplay } from './FavEntry';
import { Link } from 'react-router-dom';
import { MostUsed } from './MostUsed';
import { Navigate } from 'react-router';
import { Stack } from '@mui/material';
import { useAbfahrtenError } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { useEffect, useMemo, useState } from 'react';
import {
  useFavs,
  useMostUsedComponent,
} from '@/client/Abfahrten/provider/FavProvider';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';
import type { AbfahrtenError } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import type { FC, ReactNode } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { StaticRouterContext } from 'react-router';

function getErrorText(
  error: AbfahrtenError,
  staticContext?: StaticRouterContext,
): React.ReactNode {
  switch (error.errorType) {
    case 'redirect': {
      return <Navigate to={error.redirect} />;
    }
    case '404': {
      if (staticContext) {
        staticContext.status = 404;
      }

      return 'Die Abfahrt existiert nicht';
    }
    default: {
      if (error.code === 'ECONNABORTED') {
        return 'Timeout - bitte erneut versuchen';
      }

      return 'Unbekannter Fehler';
    }
  }
}

interface Props {
  staticContext?: StaticRouterContext;
  children?: ReactNode;
}

export const FavList: FC<Props> = ({ staticContext, children }) => {
  const favs = useFavs();
  const MostUsedComponent = useMostUsedComponent();
  const sortedFavs = useMemo(() => {
    const values: MinimalStopPlace[] = Object.values(favs);

    return values
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
      .map((fav) => <FavEntry key={fav.evaNumber} fav={fav} />);
  }, [favs]);
  const error = useAbfahrtenError();
  const [savedError] = useState(error);
  const { updateTitle, updateDescription, updateKeywords } =
    useHeaderTagsActions();

  useEffect(() => {
    updateTitle();
    updateDescription();
    updateKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack flex="1" direction="column">
      {children}
      <Zugsuche />
      {/* eslint-disable-next-line no-nested-ternary */}
      {savedError && (
        <>
          <FavEntryDisplay
            data-testid="error"
            nonClickable
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
          <FavEntryDisplay nonClickable text="Favoriten" />
          {sortedFavs}
        </>
      ) : (
        <>
          <FavEntryDisplay
            nonClickable
            data-testid="noFav"
            text="Keine Favoriten"
          />
        </>
      )}
      {MostUsedComponent && (
        <>
          <FavEntryDisplay nonClickable text="Oft Gesucht" />
          <MostUsed />
        </>
      )}
    </Stack>
  );
};
