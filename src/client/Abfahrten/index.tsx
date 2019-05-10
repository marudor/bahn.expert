import { renderRoutes } from 'react-router-config';
import Footer from './Components/Footer';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';
import useStyles from './index.style';

const BahnhofsAbfahrten = () => {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <Header />
      <SettingsModal />
      {renderRoutes(routes)}
      <Footer />
    </div>
  );
};

export default BahnhofsAbfahrten;
