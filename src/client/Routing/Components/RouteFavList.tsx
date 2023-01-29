import { RouteFavEntry } from '@/client/Routing/Components/RouteFavEntry';
import { useRoutingFavs } from '@/client/Routing/provider/RoutingFavProvider';
import type { FC } from 'react';

export const RouteFavList: FC = () => {
  const favs = useRoutingFavs();

  return (
    <div data-testid="RouteFavList">
      {Object.keys(favs).map((favKey) => {
        const fav = favs[favKey];

        return <RouteFavEntry key={favKey} fav={fav} />;
      })}
    </div>
  );
};
