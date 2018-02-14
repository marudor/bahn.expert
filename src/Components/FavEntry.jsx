// @flow
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import React from 'react';
import styles from './FavEntry.scss';

type Props = {
  fav: string,
};
const FavEntry = ({ fav }: Props) => (
  <Link to={fav.replace('%2F', '/')}>
    <Paper className={styles.fav}>
      <div className={styles.station}>{fav.replace('%2F', '/')}</div>
    </Paper>
  </Link>
);

export default FavEntry;
