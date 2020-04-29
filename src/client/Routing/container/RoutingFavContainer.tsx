import { AllowedHafasProfile } from 'types/HAFAS';
import { createContainer } from 'unstated-next';
import { ReactNode, useCallback, useState } from 'react';
import { Station } from 'types/station';
import useStorage from 'shared/hooks/useStorage';

export type RoutingFavStation = Pick<Station, 'title' | 'id'>;
export interface RoutingFav {
  start: RoutingFavStation;
  destination: RoutingFavStation;
  via: RoutingFavStation[];
  profile: AllowedHafasProfile;
}
interface RoutingFavs {
  [key: string]: RoutingFav;
}

function useRoutingFavStorage(initialFavs: RoutingFavs = {}) {
  const [favs, setFavs] = useState<RoutingFavs>(initialFavs);
  const storage = useStorage();
  const updateFavs = useCallback(
    (newFavs: RoutingFavs) => {
      storage.set('rfavs', newFavs);
      setFavs(newFavs);
    },
    [storage]
  );

  return {
    favs,
    updateFavs,
  };
}

const RoutingFavContainer = createContainer(useRoutingFavStorage);

export default RoutingFavContainer;
export function routingFavKey(fav: RoutingFav) {
  return `${fav.start.id}${fav.via.map((s) => s.id)}${fav.destination.id}${
    fav.profile
  }`;
}
export function useRoutingFavAction() {
  const { favs, updateFavs } = RoutingFavContainer.useContainer();

  const unfav = useCallback(
    (fav: RoutingFav) => {
      delete favs[routingFavKey(fav)];
      updateFavs({ ...favs });
    },
    [favs, updateFavs]
  );

  const fav = useCallback(
    (fav: RoutingFav) => {
      updateFavs({
        ...favs,
        [routingFavKey(fav)]: fav,
      });
    },
    [favs, updateFavs]
  );

  return {
    fav,
    unfav,
  };
}

interface Props {
  children: ReactNode;
}

export const RoutingFavProvider = ({ children }: Props) => {
  const storage = useStorage();
  const savedRoutingFavs = storage.get('rfavs');

  return (
    <RoutingFavContainer.Provider initialState={savedRoutingFavs}>
      {children}
    </RoutingFavContainer.Provider>
  );
};
