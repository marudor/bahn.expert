import React, { Context, useContext } from 'react';
import StorageInterface from './StorageInterface';

// @ts-ignore
export const StorageContext: Context<StorageInterface> = React.createContext();

export default () => useContext(StorageContext);
