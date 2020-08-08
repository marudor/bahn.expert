import { RouteFavEntry } from 'client/Routing/Components/RouteFavEntry';
import { useRoutingFavs } from 'client/Routing/provider/RoutingFavProvider';

export const RouteFavList = () => {
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
