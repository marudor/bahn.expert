import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { renderRoutes } from 'react-router-config';
import Footer from './Components/Footer';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';

type Props = WithStyles<typeof styles>;

const BahnhofsAbfahrten = ({ classes }: Props) => (
  <div className={classes.main}>
    <Header />
    <SettingsModal />
    {renderRoutes(routes)}
    <Footer />
  </div>
);

const styles = createStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  },
});

export default withStyles(styles)(BahnhofsAbfahrten);
