// @flow
import React from 'react';
import SettingsModal from './Components/SettingsModal';
// import Privacy from './Privacy';
import { renderRoutes } from 'react-router-config';
import Footer from './Components/Footer';
import Header from './Components/Header';
import routes from './routes';
import withStyles, { type StyledProps } from 'react-jss';

type Props = StyledProps<{||}, typeof styles>;

const BahnhofsAbfahrten = ({ classes }: Props) => (
  <div className={classes.main}>
    <Header />
    <SettingsModal />
    {renderRoutes(routes)}
    <Footer />
  </div>
);

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  },
};

export default withStyles<Props>(styles)(BahnhofsAbfahrten);
