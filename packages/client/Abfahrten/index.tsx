import { AbfahrtenProvider } from 'client/Abfahrten/provider/AbfahrtenProvider';
import { AuslastungsProvider } from 'client/Abfahrten/provider/AuslastungsProvider';
import { FavProvider } from './provider/FavProvider';
import { getStopPlacesFromAPI } from 'client/Common/service/stopPlaceSearch';
import { Header } from './Components/Header';
import { MainWrap } from 'client/Common/Components/MainWrap';
import { MostUsed } from 'client/Abfahrten/Components/MostUsed';
import { renderRoutes } from 'react-router-config';
import { routes } from './routes';
import { SettingsModal } from './Components/SettingsModal';
import { useQuery } from 'client/Common/hooks/useQuery';
import type { FC } from 'react';

const stopPlaceApiFunction = getStopPlacesFromAPI.bind(
  undefined,
  true,
  1,
  undefined,
);

export const BahnhofsAbfahrten: FC = () => {
  const noHeader = useQuery().noHeader;

  return (
    <AuslastungsProvider>
      <AbfahrtenProvider
        urlPrefix="/"
        fetchApiUrl="/api/iris/v2/abfahrten"
        stopPlaceApiFunction={stopPlaceApiFunction}
      >
        <FavProvider storageKey="favs" MostUsedComponent={MostUsed}>
          <MainWrap noHeader={Boolean(noHeader)}>
            {!noHeader && <Header />}
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
