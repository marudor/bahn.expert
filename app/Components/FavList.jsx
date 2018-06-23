// @flow
import './FavList.scss';
import { connect } from 'react-redux';
import { setCurrentStation } from 'actions/abfahrten';
import FavEntry from './FavEntry';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type ReduxProps = {
  favs: $PropertyType<$PropertyType<AppState, 'fav'>, 'favs'>,
};
type Props = ReduxProps & {
  setCurrentStation: typeof setCurrentStation,
};

const FavList = ({ favs, setCurrentStation }: Props) => {
  setCurrentStation(null);

  // $FlowFixMe
  const favValues: Station[] = Object.values(favs);

  return (
    <div className="FavList">
      {favValues.length ? (
        favValues
          .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
          .map(fav => fav && <FavEntry key={fav.id} fav={fav.title} />)
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
    favs: state.fav.favs,
  }),
  {
    setCurrentStation,
  }
)(FavList);
