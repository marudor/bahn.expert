import { AbfahrtenState } from 'AppState';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import Header from './Components/Header';
import React from 'react';
import routes from './routes';
import SettingsModal from './Components/SettingsModal';
import useStyles from './index.style';

type StateProps = {
  noHeader: boolean;
};
export type Props = StateProps;
const BahnhofsAbfahrten = (props: Props) => {
  const classes = useStyles(props);

  return (
    <div className={classes.main}>
      {!props.noHeader && <Header />}
      <SettingsModal />
      {renderRoutes(routes)}
    </div>
  );
};

export default connect<StateProps, {}, {}, AbfahrtenState>(state => ({
  noHeader: state.abfahrtenConfig.config.noHeader,
}))(BahnhofsAbfahrten);
