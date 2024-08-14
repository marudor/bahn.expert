import type { Favs } from '@/client/Abfahrten/provider/FavProvider';
import type { StorageInterface } from '@/client/Common/Storage';
import type { CommonConfig } from '@/client/Common/config';
import type { RoutingSettings } from '@/client/Routing/provider/RoutingConfigProvider';
import type { RoutingFavs } from '@/client/Routing/provider/RoutingFavProvider';
import { createContext, useContext } from 'react';
import type { Context } from 'react';

export interface WebConfigMap extends CommonConfig, RoutingSettings {
	readonly selectedDetail: string;
	readonly regionalFavs: Favs;
	readonly favs: Favs;
	readonly rfavs: RoutingFavs;
	readonly defaultFilter: string[];
	readonly timesPoliticSeenNew: number;
	readonly seenCoachSequence: boolean;
}

// @ts-expect-error context without default is fine
export const StorageContext: Context<StorageInterface> = createContext();

export const useStorage = (): StorageInterface => useContext(StorageContext);
