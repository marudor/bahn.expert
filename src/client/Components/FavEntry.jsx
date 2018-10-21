// @flow
import './FavEntry.scss';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import React from 'react';

type Props = {
  fav: string,
};
const FavEntry = ({ fav }: Props) => (
  <Paper className="FavEntry__fav">
    <Link to={encodeURIComponent(fav)}>
      <span className="FavEntry__station">{fav}</span>
    </Link>
  </Paper>
);

export default FavEntry;
