import { createContext } from 'react';

interface NavigationContext {
	toggleDrawer: () => void;
}

// @ts-expect-error default context unneccesary
export const NavigationContext = createContext<NavigationContext>();
