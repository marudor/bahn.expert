import { AbfahrtenConfigProvider } from 'Abfahrten/container/AbfahrtenConfigContainer';
import { FavProvider } from './container/FavContainer';
import { renderRoutes } from 'react-router-config';
import { useAbfahrtenSelector } from 'useSelector';
import AuslastungContainer from './container/AuslastungContainer';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';
import useStyles from './index.style';

const BahnhofsAbfahrten = () => {
  const noHeader = useAbfahrtenSelector(
    state => state.abfahrtenConfig.config.noHeader
  );
  const classes = useStyles({ noHeader });

  return (
    <AuslastungContainer.Provider>
      <AbfahrtenConfigProvider>
        <FavProvider>
          <div className={classes.main}>
            {!noHeader && <Header />}
            <SettingsModal />
            {renderRoutes(routes)}
          </div>
        </FavProvider>
      </AbfahrtenConfigProvider>
    </AuslastungContainer.Provider>
  );
};

export default BahnhofsAbfahrten;
