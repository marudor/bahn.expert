import { createContext } from 'react';

interface NavigationContext {
  toggleDrawer: () => void;
}

// @ts-ignore
export const NavigationContext = createContext<NavigationContext>();
