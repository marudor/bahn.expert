import { ComponentType, ReactNode, useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';
import useWebStorage from 'client/useWebStorage';
import type { Station } from 'types/station';

export interface Favs {
  [key: string]: Station;
}

interface FavStorageSetup {
  favs: Favs;
  storageKey: string;
  MostUsedComponent?: ComponentType;
}

function useFavStorage(setup: FavStorageSetup) {
  const [favs, setFavs] = useState<Favs>(setup.favs);

  const storage = useWebStorage();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      storage.set(setup.storageKey, newFavs);
      setFavs(newFavs);
    },
    [setup.storageKey, storage]
  );

  return {
    favs,
    updateFavs,
    count: Object.keys(favs).length,
    MostUsedComponent: setup.MostUsedComponent,
  };
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
  storageKey: 'favs' | 'regionalFavs';
  MostUsedComponent?: ComponentType;
}

export const FavProvider = ({
  children,
  storageKey,
  MostUsedComponent,
}: Props) => {
  const storage = useWebStorage();
  const savedFavs = storage.get(storageKey);

  return (
    <FavContainer.Provider
      initialState={{
        favs: savedFavs || {},
        storageKey,
        MostUsedComponent,
      }}
    >
      {children}
    </FavContainer.Provider>
  );
};
