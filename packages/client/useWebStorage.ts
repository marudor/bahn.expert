import { AbfahrtenConfig, CommonConfig } from 'client/Common/config';
import { Favs } from 'client/Abfahrten/provider/FavProvider';
import { RoutingFavs } from 'client/Routing/provider/RoutingFavProvider';
import { RoutingSettings } from 'client/Routing/provider/RoutingConfigProvider';
import { useStorage } from 'shared/hooks/useStorage';

export interface WebConfigMap
  extends AbfahrtenConfig,
    CommonConfig,
    RoutingSettings {
  selectedDetail: string;
  regionalFavs: Favs;
  favs: Favs;
  rfavs: RoutingFavs;
}

export const useWebStorage = () => useStorage<WebConfigMap>();
