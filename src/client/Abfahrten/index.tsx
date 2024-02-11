import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { AbfahrtenRoutes } from '@/client/Abfahrten/AbfahrtenRoutes';
import { AuslastungsProvider } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { FavProvider } from './provider/FavProvider';
import { getStopPlacesFromAPI } from '@/client/Common/service/stopPlaceSearch';
import { Header } from './Components/Header';
import { MainWrap } from '@/client/Common/Components/MainWrap';
import { MostUsed } from '@/client/Abfahrten/Components/MostUsed';
import type { FC } from 'react';

const stopPlaceApiFunction = getStopPlacesFromAPI.bind(
  undefined,
  true,
  1,
  undefined,
);

export const Abfahrten: FC = () => {
  return (
    <AuslastungsProvider>
      <AbfahrtenProvider
        urlPrefix="/"
        fetchApiUrl="/api/iris/v2/abfahrten"
        stopPlaceApiFunction={stopPlaceApiFunction}
      >
        <FavProvider storageKey="favs" MostUsedComponent={MostUsed}>
          <MainWrap>
            <Header />
            <AbfahrtenRoutes />
          </MainWrap>
        </FavProvider>
      </AbfahrtenProvider>
    </AuslastungsProvider>
  );
};
// eslint-disable-next-line import/no-default-export
export default Abfahrten;
