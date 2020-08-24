import { AllowedHafasProfile } from 'types/HAFAS';
import { PropsWithChildren, useCallback, useState } from 'react';
import { Station } from 'types/station';
import { useStorage } from 'client/useStorage';
import constate from 'constate';

export type RoutingFavStation = Pick<Station, 'title' | 'id'>;
export interface RoutingFav {
  start: RoutingFavStation;
  destination: RoutingFavStation;
  via: RoutingFavStation[];
  profile: AllowedHafasProfile;
}
export interface RoutingFavs {
  [key: string]: RoutingFav;
}

export function routingFavKey(fav: RoutingFav) {
  return `${fav.start.id}${fav.via.map((s) => s.id)}${fav.destination.id}${
    fav.profile
  }`;
}

interface InitialRoutingFavStorageProps {
  initialFavs?: RoutingFavs;
}

function useRoutingFavStorage({ initialFavs }: InitialRoutingFavStorageProps) {
  const [favs, setFavs] = useState<RoutingFavs>(initialFavs || {});
  const storage = useStorage();
  const updateFavs = useCallback(
    (updateFn: (oldFavs: RoutingFavs) => RoutingFavs) => {
      setFavs((oldFavs) => {
        const newFavs = updateFn(oldFavs);
        storage.set('rfavs', newFavs);
        return newFavs;
      });
    },
    [storage],
  );

  const unfav = useCallback(
    (fav: RoutingFav) => {
      updateFavs((oldFavs) => {
        delete oldFavs[routingFavKey(fav)];
        return { ...oldFavs };
      });
    },
    [updateFavs],
  );

  const favorite = useCallback(
    (fav: RoutingFav) => {
      updateFavs((oldFavs) => ({
        ...oldFavs,
        [routingFavKey(fav)]: fav,
      }));
    },
    [updateFavs],
  );

  return {
    favs,
    fav: favorite,
    unfav,
  };
}

export const [
  InnerRoutingFavProvider,
  useRoutingFavs,
  useRoutingFavActions,
] = constate(
  useRoutingFavStorage,
  (v) => v.favs,
  (v) => ({
    fav: v.fav,
    unfav: v.unfav,
  }),
);

export const RoutingFavProvider = ({ children }: PropsWithChildren<{}>) => {
  const storage = useStorage();
  const savedRoutingFavs = storage.get('rfavs');
  return (
    <InnerRoutingFavProvider initialFavs={savedRoutingFavs}>
      {children}
    </InnerRoutingFavProvider>
  );
};
