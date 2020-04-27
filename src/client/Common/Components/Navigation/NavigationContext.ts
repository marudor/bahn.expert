import { createContext } from 'react';

interface NavigationContext {
  toggleDrawer: () => void;
}

// @ts-ignore
export default createContext<NavigationContext>();
