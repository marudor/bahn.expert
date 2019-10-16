import React from 'react';
import RouteList from './RouteList';
import Search from './Search';

const Routing = () => {
  return (
    <div>
      <Search />
      <div style={{ marginBottom: '1em' }} />
      <RouteList />
    </div>
  );
};

export default Routing;
