import { ComponentType, ReactNode, useCallback, useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { Station } from 'types/station';

export interface Favs {
  [key: string]: Station;
}

interface FavStorageSetup {
  favs: Favs;
  storageKey: 'favs' | 'regionalFavs';
  MostUsedComponent?: ComponentType;
}

function useFavStorage({ initial }: { initial: FavStorageSetup }) {
  const [favs, setFavs] = useState<Favs>(initial.favs);

  const storage = useStorage();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      storage.set(initial.storageKey, newFavs);
      setFavs(newFavs);
    },
    [initial.storageKey, storage]
  );

  const fav = useCallback(
    (station: Station) => {
      setFavs((oldFavs) => {
        const newFavs = {
          ...oldFavs,
          [station.id]: {
            title: station.title,
            id: station.id,
          },
        };
        storage.set(initial.storageKey, newFavs);
        return newFavs;
      });
    },
    [initial.storageKey, storage]
  );

  const unfav = useCallback(
    (station: Station) => {
      setFavs((oldFavs) => {
        delete oldFavs[station.id];
        const newFavs = { ...oldFavs };
        storage.set(initial.storageKey, newFavs);
        return newFavs;
      });
    },
    [initial.storageKey, storage]
  );

  return {
    favs,
    updateFavs,
    count: Object.keys(favs).length,
    MostUsedComponent: initial.MostUsedComponent,
    fav,
    unfav,
  };
}

export const [
  InnerFavProvider,
  useFav,
  useUnfav,
  useFavs,
  useMostUsedComponent,
] = constate(
  useFavStorage,
  (v) => v.fav,
  (v) => v.unfav,
  (v) => v.favs,
  (v) => v.MostUsedComponent
);

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
  const storage = useStorage();
  const savedFavs = storage.get(storageKey);

  return (
    <InnerFavProvider
      initial={{
        favs: savedFavs || {},
        storageKey,
        MostUsedComponent,
      }}
    >
      {children}
    </InnerFavProvider>
  );
};
