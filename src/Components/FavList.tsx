import Paper from 'material-ui/Paper';
import { observer } from 'mobx-react';
import * as React from 'react';
import FavService from 'Services/FavService';
import FavEntry from './FavEntry';

const FavList = observer((props: any) => (
  <div style={style.wrap}>
    {FavService.favs.size ? FavService.favs.map((fav) => fav && (
      <FavEntry key={fav.id} fav={fav.title} />
    )).toList() : (
        <Paper>
          Bisher hast du keine Favoriten.
      </Paper>
      )}
  </div>
));

export default FavList;

const style: any = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
};
