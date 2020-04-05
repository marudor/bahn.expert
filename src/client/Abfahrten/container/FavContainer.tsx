import { createContainer } from 'unstated-next';
import { Station } from 'types/station';
import React, { ReactNode, useCallback, useState } from 'react';
import useStorage from 'shared/hooks/useStorage';

interface Favs {
  [key: string]: Station;
}

interface FavStorageSetup {
  favs: Favs;
  storageKey: string;
}

function useFavStorage(setup: FavStorageSetup) {
  const [favs, setFavs] = useState<Favs>(setup.favs);

  const storage = useStorage();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      storage.set(setup.storageKey, newFavs);
      setFavs(newFavs);
    },
    [setup.storageKey, storage]
  );

  return { favs, updateFavs, count: Object.keys(favs).length };
}

// @ts-ignore - this works, complains about missing default
const FavContainer = createContainer(useFavStorage);

export function useFav() {
  const { favs, updateFavs } = FavContainer.useContainer();
  const fav = useCallback(
    (station: Station) => {
      const newFavs = {
        ...favs,
        [station.id]: {
          title: station.title,
          id: station.id,
        },
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
  storageKey: string;
}

export const FavProvider = ({ children, storageKey }: Props) => {
  const storage = useStorage();
  const savedFavs = storage.get(storageKey);

  return (
    <FavContainer.Provider
      initialState={{
        favs: savedFavs || {},
        storageKey,
      }}
    >
      {children}
    </FavContainer.Provider>
  );
};
