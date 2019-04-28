import { CommonState } from 'AppState';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AbfahrtenActions from 'Abfahrten/actions/abfahrten';
import ActionHome from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useState } from 'react';

type StateProps = {
  routingFeature: boolean;
};
type DispatchProps = {
  setCurrentStation: typeof AbfahrtenActions.setCurrentStation;
};
type Props = StateProps & RouteComponentProps & DispatchProps;

const HomeMenu = ({ history, routingFeature, setCurrentStation }: Props) => {
  const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);

  const toggleMenu = (e: SyntheticEvent<HTMLElement>) =>
    setAnchor(anchor ? undefined : e.currentTarget);
  const toAbfahrten = (e: SyntheticEvent<HTMLElement>) => {
    setCurrentStation();
    history.push('/');
    toggleMenu(e);
  };
  const toRouting = (e: SyntheticEvent<HTMLElement>) => {
    history.push('/routing');
    toggleMenu(e);
  };

  return (
    <>
      <IconButton
        aria-label="Home"
        onClick={routingFeature ? toggleMenu : toAbfahrten}
        color="inherit"
      >
        <ActionHome color="inherit" />
      </IconButton>
      {routingFeature && (
        <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
          <MenuItem onClick={toAbfahrten}>Abfahrten</MenuItem>
          <MenuItem onClick={toRouting}>Routing (WIP)</MenuItem>
        </Menu>
      )}
    </>
  );
};

export default connect<StateProps, DispatchProps, {}, CommonState>(
  state => ({
    routingFeature: state.features.routing,
  }),
  {
    setCurrentStation: AbfahrtenActions.setCurrentStation,
  }
)(withRouter(HomeMenu));
