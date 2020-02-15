import React from 'react';
import RouteFavEntry from 'Routing/Components/RouteFavEntry';
import RoutingFavContainer from 'Routing/container/RoutingFavContainer';

const RouteFavList = () => {
  const { favs } = RoutingFavContainer.useContainer();

  return (
    <div>
      {Object.keys(favs).map(favKey => {
        const fav = favs[favKey];

        return <RouteFavEntry key={favKey} fav={fav} />;
      })}
    </div>
  );
};

export default RouteFavList;
