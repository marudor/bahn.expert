import { createContainer } from 'unstated-next';
import { setCookieOptions } from 'client/util';
import { Station } from 'types/station';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';

type Favs = { [key: string]: Station };

function useFavStorage(initialFavs: Favs = {}) {
  const [favs, setFavs] = useState<Favs>(initialFavs);
  const cookies = useCookies();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      cookies.set('favs', newFavs, setCookieOptions);
      setFavs(newFavs);
    },
    [cookies]
  );

  return { favs, updateFavs, count: Object.keys(favs).length };
}

const FavContainer = createContainer(useFavStorage);

export function useFav() {
  const { favs, updateFavs } = FavContainer.useContainer();
  const fav = useCallback(
    (station: Station) => {
      const newFavs = {
        ...favs,
        [station.id]: station,
      };

      updateFavs(newFavs);
    },
    [favs, updateFavs]
  );

  return fav;
}

export function useUnfav() {
  const { favs, updateFavs } = FavContainer.useContainer();

  const unfav = useCallback(
    (station: Station) => {
      delete favs[station.id];
      updateFavs({ ...favs });
    },
    [favs, updateFavs]
  );

  return unfav;
}

export default FavContainer;

type Props = {
  children: ReactNode;
};

export const FavProvider = ({ children }: Props) => {
  const cookies = useCookies();
  const savedFavs = cookies.get('favs');

  return (
    <FavContainer.Provider initialState={savedFavs}>
      {children}
    </FavContainer.Provider>
  );
};
