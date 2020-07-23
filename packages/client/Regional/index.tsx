import { AbfahrtenProvider } from 'client/Abfahrten/container/AbfahrtenContainer';
import { AllowedHafasProfile } from 'types/HAFAS';
import { FavProvider } from 'client/Abfahrten/container/FavContainer';
import { getHafasStationFromAPI } from 'shared/service/stationSearch';
import { renderRoutes } from 'react-router-config';
import AuslastungContainer from 'client/Abfahrten/container/AuslastungContainer';
import Header from 'client/Abfahrten/Components/Header';
import MainWrap from 'client/Common/Components/MainWrap';
import routes from './routes';
import SettingsModal from 'client/Abfahrten/Components/SettingsModal';
import useQuery from 'client/Common/hooks/useQuery';

const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;

  return (
    <AuslastungContainer.Provider>
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
    </AuslastungContainer.Provider>
  );
};

export default BahnhofsAbfahrten;
