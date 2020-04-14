import React from 'react';

interface NavigationContext {
  toggleDrawer: () => void;
}

// @ts-ignore
export default React.createContext<NavigationContext>();
