// @flow
import './FavEntry.scss';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import React from 'react';

type Props = {
  fav: string,
};
const FavEntry = ({ fav }: Props) => (
  <Link to={fav.replace('%2F', '/')}>
    <Paper className="FavEntry__fav">
      <div className="FavEntry__station">{fav.replace('%2F', '/')}</div>
    </Paper>
  </Link>
);

export default FavEntry;
