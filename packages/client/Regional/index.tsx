import { AbfahrtenProvider } from 'client/Abfahrten/provider/AbfahrtenProvider';
import { AllowedHafasProfile } from 'types/HAFAS';
import { AuslastungsProvider } from 'client/Abfahrten/provider/AuslastungsProvider';
import { FavProvider } from 'client/Abfahrten/provider/FavProvider';
import { getHafasStationFromAPI } from 'shared/service/stationSearch';
import { Header } from 'client/Abfahrten/Components/Header';
import { MainWrap } from 'client/Common/Components/MainWrap';
import { renderRoutes } from 'react-router-config';
import { routes } from './routes';
import { SettingsModal } from 'client/Abfahrten/Components/SettingsModal';
import { useQuery } from 'client/Common/hooks/useQuery';

export const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;

  return (
    <AuslastungsProvider>
      <AbfahrtenProvider
        urlPrefix="/regional/"
        fetchApiUrl="/api/hafas/experimental/irisCompatibleAbfahrten"
        stationApiFunction={(_, stationName) =>
          getHafasStationFromAPI(undefined, stationName)
        }
      >
        <FavProvider storageKey="regionalFavs">
          <MainWrap noHeader={Boolean(noHeader)}>
            {!noHeader && <Header profile={AllowedHafasProfile.DB} />}
            <SettingsModal />
            {renderRoutes(routes)}
          </MainWrap>
        </FavProvider>
      </AbfahrtenProvider>
    </AuslastungsProvider>
  );
};
// eslint-disable-next-line import/no-default-export
export default BahnhofsAbfahrten;
