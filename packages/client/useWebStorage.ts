import { AbfahrtenConfig, CommonConfig } from 'client/Common/config';
import { Favs } from 'client/Abfahrten/container/FavContainer';
import { RoutingFavs } from 'client/Routing/container/RoutingFavContainer';
import { RoutingSettings } from 'client/Routing/container/RoutingConfigContainer';
import useStorage from 'shared/hooks/useStorage';

export interface WebConfigMap
  extends AbfahrtenConfig,
    CommonConfig,
    RoutingSettings {
  selectedDetail: string;
  regionalFavs: Favs;
  favs: Favs;
  rfavs: RoutingFavs;
}

export default () => useStorage<WebConfigMap>();
