// @flow
import { connect } from 'react-redux';
import { fav, unfav } from 'actions/fav';
import ActionSearch from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
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
        {isFaved ? <ToggleStar color="secondary" /> : <ToggleStarBorder color="secondary" />}
      </IconButton>
    );
  }
  render() {
    return (
      <div>
        <IconButton onClick={this.props.handleSearchClick}>
          <ActionSearch color="secondary" />
        </IconButton>
        {this.getFavButton()}
      </div>
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
  }
)(HeaderButtons);
