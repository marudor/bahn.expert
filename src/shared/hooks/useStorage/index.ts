import React, { Context, useContext } from 'react';
import StorageInterface from './StorageInterface';

// @ts-expect-error
export const StorageContext: Context<StorageInterface> = React.createContext();

export default () => useContext(StorageContext);
