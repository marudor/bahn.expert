// @flow
import './FavList.scss';
import { connect } from 'react-redux';
import { setCurrentStation } from 'actions/abfahrten';
import FavEntry from './FavEntry';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import type { AppState } from 'AppState';

type ReduxProps = {
  favs: $PropertyType<$PropertyType<AppState, 'fav'>, 'favs'>,
};
type Props = ReduxProps & {
  setCurrentStation: typeof setCurrentStation,
};

const FavList = ({ favs, setCurrentStation }: Props) => {
  setCurrentStation(null);

  return (
    <div className="FavList">
      {favs.size ? (
        favs
          .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
          .map(fav => fav && <FavEntry key={fav.id} fav={fav.title} />)
          .toList()
      ) : (
        <Paper>{'Bisher hast du keine Favoriten.'}</Paper>
      )}
    </div>
  );
};

export default connect(
  (state: AppState): ReduxProps => ({
    favs: state.fav.favs,
  }),
  {
    setCurrentStation,
  }
)(FavList);
