import { AbfahrtenProvider } from 'client/Abfahrten/container/AbfahrtenContainer';
import { FavProvider } from './container/FavContainer';
import { renderRoutes } from 'react-router-config';
import AuslastungContainer from './container/AuslastungContainer';
import Header from './Components/Header';
import MostUsed from 'client/Abfahrten/Components/MostUsed';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';
import useQuery from 'client/Common/hooks/useQuery';
import useStyles from './index.style';

const BahnhofsAbfahrten = () => {
  const noHeader = useQuery().noHeader;
  const classes = useStyles({ noHeader: Boolean(noHeader) });

  return (
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
  );
};

export default BahnhofsAbfahrten;
