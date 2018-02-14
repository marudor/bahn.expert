// @flow
import { connect } from 'react-redux';
import { fav, unfav } from 'actions/fav';
import ActionSearch from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type ReduxProps = {
  isFaved: boolean,
  currentStation: ?Station,
};

type Props = ReduxProps & {
  handleSearchClick: () => void,
  fav: typeof fav,
  unfav: typeof unfav,
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
  getFavButton() {
    const { currentStation, isFaved } = this.props;

    if (!currentStation || currentStation.id === 0) {
      return null;
    }

    return (
      <IconButton onClick={this.toggleFav}>
        {isFaved ? <ToggleStar color="white" /> : <ToggleStarBorder color="white" />}
      </IconButton>
    );
  }
  render() {
    return (
      <div>
        <IconButton onClick={this.props.handleSearchClick}>
          <ActionSearch color="white" />
        </IconButton>
        {this.getFavButton()}
      </div>
    );
  }
}

export default connect(
  (state: AppState): ReduxProps => ({
    isFaved: Boolean(state.abfahrten.currentStation && state.fav.favs.has(state.abfahrten.currentStation.id)),
    currentStation: state.abfahrten.currentStation,
  }),
  {
    fav,
    unfav,
  }
)(HeaderButtons);
