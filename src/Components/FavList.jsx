// @flow
import { observer } from 'mobx-react';
import FavEntry from './FavEntry';
import FavService from 'Services/FavService';
import Paper from 'material-ui/Paper';
import React from 'react';

const FavList = () => (
  <div style={style.wrap}>
    {FavService.favs.size
      ? FavService.favs
          .map(fav => fav && <FavEntry key={fav.id} fav={fav.title} />)
          .toList()
      : <Paper>
          {'Bisher hast du keine Favoriten.'}
        </Paper>}
  </div>
);

export default observer(FavList);

const style = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
};
