import { createContainer } from 'unstated-next';
import { Station } from 'types/station';
import React, { ReactNode, useCallback, useState } from 'react';
import useStorage from 'shared/hooks/useStorage';

interface Favs {
  [key: string]: Station;
}

function useFavStorage(initialFavs: Favs = {}) {
  const [favs, setFavs] = useState<Favs>(initialFavs);

  const storage = useStorage();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      storage.set('favs', newFavs);
      setFavs(newFavs);
    },
    [storage]
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

interface Props {
  children: ReactNode;
}

export const FavProvider = ({ children }: Props) => {
  const storage = useStorage();
  const savedFavs = storage.get('favs');

  return (
    <FavContainer.Provider initialState={savedFavs}>
      {children}
    </FavContainer.Provider>
  );
};
