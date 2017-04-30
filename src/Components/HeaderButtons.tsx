import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';
import { observer } from 'mobx-react';
import * as React from 'react';
import FavService from 'Services/FavService';
import StationService from 'Services/StationService';

interface IProps {
  handleSearchClick: () => void;
}
@observer
export default class HeaderButtons extends React.PureComponent<IProps, {}> {
  private toggleFav() {
    const station = StationService.currentStation;
    if (FavService.isFaved(station)) {
      FavService.unfav(station);
    } else {
      FavService.fav(station);
    }
  }
  private getFavButton() {
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
  public render() {
    return (
      <div>
        <IconButton onTouchTap={this.props.handleSearchClick} >
          <ActionSearch color="white" />
        </IconButton>
        {this.getFavButton()}
      </div>
    );
  }
}
