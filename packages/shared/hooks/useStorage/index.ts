import { Context, createContext, useContext } from 'react';
import type StorageInterface from './StorageInterface';

// @ts-ignore
export const StorageContext: Context<StorageInterface<any>> = createContext();

export default <ConfigMap>() =>
  useContext<StorageInterface<ConfigMap>>(StorageContext);
