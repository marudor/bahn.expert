import React from 'react';
import RouteList from './RouteList';
import Search from './Search';

const Routing = () => {
  return (
    <main style={{ marginLeft: '.5em', marginRight: '.5em' }}>
      <Search />
      <RouteList />
    </main>
  );
};

export default Routing;
