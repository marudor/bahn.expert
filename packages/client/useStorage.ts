import { AbfahrtenConfig, CommonConfig } from 'client/Common/config';
import { Context, createContext, useContext } from 'react';
import { Favs } from 'client/Abfahrten/provider/FavProvider';
import { RoutingFavs } from 'client/Routing/provider/RoutingFavProvider';
import { RoutingSettings } from 'client/Routing/provider/RoutingConfigProvider';
import { StorageInterface } from 'client/Common/Storage';

export interface WebConfigMap
  extends AbfahrtenConfig,
    CommonConfig,
    RoutingSettings {
  readonly selectedDetail: string;
  readonly regionalFavs: Favs;
  readonly favs: Favs;
  readonly rfavs: RoutingFavs;
  readonly defaultFilter: string[];

  // legacy
  readonly config: AbfahrtenConfig;
  // legacy
  readonly commonConfig: CommonConfig;
  // legacy
  readonly rconfig: RoutingSettings;
}

// @ts-expect-error
export const StorageContext: Context<StorageInterface> = createContext();

export const useStorage = () => useContext(StorageContext);
