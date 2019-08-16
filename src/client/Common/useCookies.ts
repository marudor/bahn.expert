import Cookies from 'universal-cookie';
import React, { Context, useContext } from 'react';

// @ts-ignore
export const CookieContext: Context<Cookies> = React.createContext();

export default () => useContext(CookieContext);
