// @flow
import { observer } from 'mobx-react';
import ActionSearch from 'material-ui/svg-icons/action/search';
import FavService from 'Services/FavService';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import StationService from 'Services/StationService';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';

interface Props {
  handleSearchClick: () => void,
}
@observer
export default class HeaderButtons extends React.PureComponent {
  prips: Props;
  toggleFav() {
    const station = StationService.currentStation;
    if (station) {
      if (FavService.isFaved(station)) {
        FavService.unfav(station);
      } else {
        FavService.fav(station);
      }
    }
  }
  getFavButton() {
    if (!StationService.currentStation) {
      return null;
    }
    const isFaved = FavService.isFaved(StationService.currentStation);
    return (
      <IconButton onTouchTap={this.toggleFav}>
        {isFaved ? <ToggleStar color="white" /> : <ToggleStarBorder color="white" />}
      </IconButton>
    );
  }
  render() {
    return (
      <div>
        <IconButton onTouchTap={this.props.handleSearchClick}>
          <ActionSearch color="white" />
        </IconButton>
        {this.getFavButton()}
      </div>
    );
  }
}
