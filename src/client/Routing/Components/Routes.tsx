import React from 'react';
import RouteList from './RouteList';
import Search from './Search';

const Routing = () => {
  return (
    <main>
      <Search />
      <div style={{ marginBottom: '1em' }} />
      <RouteList />
    </main>
  );
};

export default Routing;
