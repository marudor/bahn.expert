import { AbfahrtenProvider } from 'client/Abfahrten/container/AbfahrtenContainer';
import { AllowedHafasProfile } from 'types/HAFAS';
import { FavProvider } from 'client/Abfahrten/container/FavContainer';
import { getHafasStationFromAPI } from 'shared/service/stationSearch';
import { renderRoutes } from 'react-router-config';
import AuslastungContainer from 'client/Abfahrten/container/AuslastungContainer';
import Header from 'client/Abfahrten/Components/Header';
import routes from './routes';
import SettingsModal from 'client/Abfahrten/Components/SettingsModal';
import useQuery from 'client/Common/hooks/useQuery';
import useStyles from 'client/Abfahrten/index.style';

const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;
  const classes = useStyles({ noHeader: Boolean(noHeader) });

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
          <div className={classes.main}>
            {!noHeader && <Header profile={AllowedHafasProfile.DB} />}
            <SettingsModal />
            {renderRoutes(routes)}
          </div>
        </FavProvider>
      </AbfahrtenProvider>
    </AuslastungContainer.Provider>
  );
};

export default BahnhofsAbfahrten;
