import { renderRoutes } from 'react-router-config';
import { useAbfahrtenSelector } from 'useSelector';
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
    <div className={classes.main}>
      {!noHeader && <Header />}
      <SettingsModal />
      {renderRoutes(routes)}
    </div>
  );
};

export default BahnhofsAbfahrten;
