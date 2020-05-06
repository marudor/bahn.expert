import { Context, createContext, useContext } from 'react';
import type StorageInterface from './StorageInterface';

// @ts-ignore
export const StorageContext: Context<StorageInterface> = createContext();

export default () => useContext(StorageContext);
