import { useCallback, useState } from 'react';
import { useStorage } from '@/client/useStorage';
import constate from 'constate';
import type { ComponentType, FC, PropsWithChildren, ReactNode } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

export type Favs = Record<string, MinimalStopPlace>;

interface FavStorageSetup {
  favs: Favs;
  storageKey: 'favs' | 'regionalFavs';
  MostUsedComponent?: ComponentType;
}

function useFavStorage({
  initial,
}: PropsWithChildren<{ initial: FavStorageSetup }>) {
  const [favs, setFavs] = useState<Favs>(initial.favs);

  const storage = useStorage();
  const updateFavs = useCallback(
    (newFavs: Favs) => {
      storage.set(initial.storageKey, newFavs);
      setFavs(newFavs);
    },
    [initial.storageKey, storage],
  );

  const fav = useCallback(
    (stopPlace: MinimalStopPlace) => {
      setFavs((oldFavs) => {
        const newFavs = {
          ...oldFavs,
          [stopPlace.evaNumber]: {
            name: stopPlace.name,
            evaNumber: stopPlace.evaNumber,
          },
        };
        storage.set(initial.storageKey, newFavs);
        return newFavs;
      });
    },
    [initial.storageKey, storage],
  );

  const unfav = useCallback(
    (stopPlace: MinimalStopPlace) => {
      setFavs((oldFavs) => {
        delete oldFavs[stopPlace.evaNumber];
        const newFavs = { ...oldFavs };
        storage.set(initial.storageKey, newFavs);
        return newFavs;
      });
    },
    [initial.storageKey, storage],
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

export const [InnerFavProvider, useFavActions, useFavs, useMostUsedComponent] =
  constate(
    useFavStorage,
    (v) => ({
      fav: v.fav,
      unfav: v.unfav,
    }),
    (v) => v.favs,
    (v) => v.MostUsedComponent,
  );

interface Props {
  children: ReactNode;
  storageKey: 'favs' | 'regionalFavs';
  MostUsedComponent?: ComponentType;
}

export const FavProvider: FC<Props> = ({
  children,
  storageKey,
  MostUsedComponent,
}) => {
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
