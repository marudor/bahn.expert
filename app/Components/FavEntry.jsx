// @flow
import './FavEntry.scss';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';

type Props = {
  fav: string,
};
const FavEntry = ({ fav }: Props) => (
  <Paper className="FavEntry__fav">
    <Link to={encodeURIComponent(fav)}>
      <Typography variant="display2" className="FavEntry__station">
        {fav}
      </Typography>
    </Link>
  </Paper>
);

export default FavEntry;
