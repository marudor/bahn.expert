import React from 'react';

type NavigationContext = {
  toggleDrawer: () => void;
};

// @ts-ignore
export default React.createContext<NavigationContext>();
