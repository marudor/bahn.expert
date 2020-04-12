import React from 'react';

interface NavigationContext {
  toggleDrawer: () => void;
}

// @ts-expect-error
export default React.createContext<NavigationContext>();
