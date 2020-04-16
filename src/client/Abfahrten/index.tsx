import { AbfahrtenProvider } from 'Abfahrten/container/AbfahrtenContainer';
import { FavProvider } from './container/FavContainer';
import { renderRoutes } from 'react-router-config';
import AuslastungContainer from './container/AuslastungContainer';
import Header from './Components/Header';
import MostUsed from 'Abfahrten/Components/MostUsed';
import PullRefreshWrapper from 'Common/Components/PullRefreshWrapper';
import React from 'react';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';
import useQuery from 'Common/hooks/useQuery';
import useStyles from './index.style';

const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;
  const classes = useStyles({ noHeader });

  return (
    <PullRefreshWrapper>
      <AuslastungContainer.Provider>
        <AbfahrtenProvider urlPrefix="/" fetchApiUrl="/api/iris/v1/abfahrten">
          <FavProvider storageKey="favs" MostUsedComponent={MostUsed}>
            <div className={classes.main}>
              {!noHeader && <Header />}
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
