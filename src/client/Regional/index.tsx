import { AbfahrtenProvider } from 'Abfahrten/container/AbfahrtenContainer';
import { AllowedHafasProfile } from 'types/HAFAS';
import { FavProvider } from 'Abfahrten/container/FavContainer';
import { getHafasStationFromAPI } from 'shared/service/stationSearch';
import { renderRoutes } from 'react-router-config';
import AuslastungContainer from 'Abfahrten/container/AuslastungContainer';
import Header from 'Abfahrten/Components/Header';
import PullRefreshWrapper from 'Common/Components/PullRefreshWrapper';
import React from 'react';
import routes from './routes';
import SettingsModal from 'Abfahrten/Components/SettingsModal';
import useQuery from 'Common/hooks/useQuery';
import useStyles from 'Abfahrten/index.style';

const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;
  const classes = useStyles({ noHeader });

  return (
    <PullRefreshWrapper>
      <AuslastungContainer.Provider>
        <AbfahrtenProvider
          urlPrefix="/regional/"
          fetchApiUrl="/api/hafas/experimental/irisCompatibleAbfahrten"
          stationApiFunction={(_, stationName) =>
            getHafasStationFromAPI(undefined, stationName)
          }
        >
          <FavProvider storageKey="regionalFavs">
            <div className={classes.main}>
              {!noHeader && <Header profile={AllowedHafasProfile.DB} />}
              <SettingsModal />
              {renderRoutes(routes)}
            </div>
          </FavProvider>
        </AbfahrtenProvider>
      </AuslastungContainer.Provider>
    </PullRefreshWrapper>
  );
};

export default BahnhofsAbfahrten;
