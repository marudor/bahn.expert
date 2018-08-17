// @flow
import { connect } from 'react-redux';
import { fav, unfav } from 'actions/fav';
import { openSettings } from 'actions/config';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type ReduxProps = {
  isFaved: boolean,
  currentStation: ?Station,
};

type Props = ReduxProps & {
  fav: typeof fav,
  unfav: typeof unfav,
  openSettings: typeof openSettings,
};

class HeaderButtons extends React.Component<Props> {
  toggleFav = () => {
    const { isFaved, fav, unfav, currentStation } = this.props;

    if (currentStation) {
      if (isFaved) {
        unfav(currentStation);
      } else {
        fav(currentStation);
      }
    }
  };
  openSettings = () => {
    this.props.openSettings();
  };
  render() {
    const { currentStation, isFaved } = this.props;

    return (
      <>
        {Boolean(currentStation?.id) && (
          <IconButton onClick={this.toggleFav} color="inherit">
            {isFaved ? <ToggleStar /> : <ToggleStarBorder />}
          </IconButton>
        )}
        <IconButton onClick={this.openSettings} color="inherit">
          <Settings />
        </IconButton>
      </>
    );
  }
}

export default connect(
  (state: AppState): ReduxProps => ({
    isFaved: Boolean(state.abfahrten.currentStation && state.fav.favs[state.abfahrten.currentStation.id]),
    currentStation: state.abfahrten.currentStation,
  }),
  {
    fav,
    unfav,
    openSettings,
  }
)(HeaderButtons);
