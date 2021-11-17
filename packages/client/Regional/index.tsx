import { AbfahrtenProvider } from 'client/Abfahrten/provider/AbfahrtenProvider';
import { AuslastungsProvider } from 'client/Abfahrten/provider/AuslastungsProvider';
import { FavProvider } from 'client/Abfahrten/provider/FavProvider';
import { getStopPlacesFromAPI } from 'client/Common/service/stopPlaceSearch';
import { Header } from 'client/Abfahrten/Components/Header';
import { MainWrap } from 'client/Common/Components/MainWrap';
import { RegionalRoutes } from 'client/Regional/RegionalRoutes';
import { SettingsModal } from 'client/Abfahrten/Components/SettingsModal';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { FC } from 'react';

const regionalStopPlaceApiFunction = getStopPlacesFromAPI.bind(
  undefined,
  undefined,
  7,
  true,
);

export const BahnhofsAbfahrten: FC = () => {
  const noHeader = useQuery().noHeader;

  return (
    <AuslastungsProvider>
      <AbfahrtenProvider
        urlPrefix="/regional/"
        fetchApiUrl="/api/hafas/experimental/irisCompatibleAbfahrten"
        stopPlaceApiFunction={regionalStopPlaceApiFunction}
      >
        <FavProvider storageKey="regionalFavs">
          <MainWrap noHeader={Boolean(noHeader)}>
            {!noHeader && <Header regional />}
            <SettingsModal />
            <RegionalRoutes />
          </MainWrap>
        </FavProvider>
      </AbfahrtenProvider>
    </AuslastungsProvider>
  );
};
// eslint-disable-next-line import/no-default-export
export default BahnhofsAbfahrten;
