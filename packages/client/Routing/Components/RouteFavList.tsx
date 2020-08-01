import { RouteFavEntry } from 'client/Routing/Components/RouteFavEntry';
import { RoutingFavContainer } from 'client/Routing/container/RoutingFavContainer';

export const RouteFavList = () => {
  const { favs } = RoutingFavContainer.useContainer();

  return (
    <div data-testid="RouteFavList">
      {Object.keys(favs).map((favKey) => {
        const fav = favs[favKey];

        return <RouteFavEntry key={favKey} fav={fav} />;
      })}
    </div>
  );
};
