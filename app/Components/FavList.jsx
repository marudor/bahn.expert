// @flow
import './FavList.scss';
import { connect } from 'react-redux';
import { setCurrentStation } from 'actions/abfahrten';
import { sortedFavValues } from 'selector/fav';
import FavEntry from './FavEntry';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type ReduxProps = {
  favs: Station[],
};
type Props = ReduxProps & {
  setCurrentStation: typeof setCurrentStation,
};

const FavList = ({ favs, setCurrentStation }: Props) => {
  setCurrentStation(null);

  return (
    <div className="FavList">
      {favs.length ? (
        favs.map(fav => fav && <FavEntry key={fav.id} fav={fav.title} />)
      ) : (
        <Typography variant="display2" className="FavEntry__station">
          {'Bisher hast du keine Favoriten.'}
        </Typography>
      )}
    </div>
  );
};

export default connect(
  (state: AppState): ReduxProps => ({
    favs: sortedFavValues(state),
  }),
  {
    setCurrentStation,
  }
)(FavList);
