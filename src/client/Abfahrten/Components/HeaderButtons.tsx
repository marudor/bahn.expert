import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { fav, unfav } from 'Abfahrten/actions/fav';
import { getLageplan } from 'Abfahrten/actions/abfahrten';
import { openSettings } from 'Abfahrten/actions/config';
import { Station } from 'types/station';
import { withSnackbar, withSnackbarProps } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import React from 'react';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';
import Tooltip from '@material-ui/core/Tooltip';

type StateProps = {
  isFaved: boolean;
  currentStation?: Station;
  lageplan?: null | string;
};
type DispatchProps = ResolveThunks<{
  fav: typeof fav;
  unfav: typeof unfav;
  openSettings: typeof openSettings;
  getLageplan: typeof getLageplan;
}>;

type ReduxProps = StateProps & DispatchProps;

type Props = ReduxProps & withSnackbarProps;

class HeaderButtons extends React.PureComponent<Props> {
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
  openLageplan = async () => {
    const {
      lageplan,
      getLageplan,
      currentStation,
      enqueueSnackbar,
      closeSnackbar,
    } = this.props;

    if (lageplan === undefined && currentStation) {
      const snackId = enqueueSnackbar(
        `Lade Gleisplan für ${currentStation.title}`,
        { variant: 'info' }
      );
      const fetchedLageplan = await getLageplan(currentStation.title);

      if (snackId) {
        if (fetchedLageplan) {
          closeSnackbar(snackId);
          window.open(fetchedLageplan, '_blank');
        } else {
          closeSnackbar(snackId);
          enqueueSnackbar(
            `Kein Gleisplan vorhanden für ${currentStation.title}`,
            { variant: 'error' }
          );
        }
      }
    } else if (lageplan) {
      window.open(lageplan, '_blank');
    }
  };
  getLageplan = () => {
    const { lageplan } = this.props;

    if (lageplan !== null) {
      return (
        <Tooltip title="Gleisplan">
          <IconButton color="inherit" onClick={this.openLageplan}>
            <Layers />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Kein Gleisplan vorhanden">
        <IconButton aria-label="kein gleisplan" color="inherit">
          <LayersClear />
        </IconButton>
      </Tooltip>
    );
  };
  render() {
    const { currentStation, isFaved } = this.props;

    return (
      <>
        {currentStation && Boolean(currentStation.id) && (
          <Tooltip
            title={`${isFaved ? 'entferne' : 'merke'} ${currentStation.title}`}
          >
            <IconButton
              aria-label={isFaved ? 'unfav' : 'fav'}
              onClick={this.toggleFav}
              color="inherit"
            >
              {isFaved ? <ToggleStar /> : <ToggleStarBorder />}
            </IconButton>
          </Tooltip>
        )}
        {Boolean(currentStation && currentStation.id) && this.getLageplan()}
        <Tooltip title="Einstellungen">
          <IconButton
            aria-label="settings"
            onClick={this.openSettings}
            color="inherit"
          >
            <Settings />
          </IconButton>
        </Tooltip>
      </>
    );
  }
}

export default connect<StateProps, DispatchProps, void, AbfahrtenState>(
  state => ({
    isFaved: Boolean(
      state.abfahrten.currentStation &&
        state.fav.favs[state.abfahrten.currentStation.id]
    ),
    currentStation: state.abfahrten.currentStation,
    lageplan: state.abfahrten.lageplan,
  }),
  {
    fav,
    unfav,
    openSettings,
    getLageplan,
  }
)(withSnackbar(HeaderButtons));
