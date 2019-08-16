import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { Station } from 'types/station';
import { useUnfav } from 'Abfahrten/container/FavContainer';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React, { MouseEvent, ReactNode, useCallback } from 'react';
import useStyles from './FavEntry.style';

type Props = {
  fav: Station;
  noDelete?: boolean;
};

type FavEntryDisplayProps = {
  deleteFav?: (e: MouseEvent) => void;
  text: ReactNode;
  'data-testid'?: string;
};
export const FavEntryDisplay = ({
  deleteFav,
  text,
  'data-testid': testid,
}: FavEntryDisplayProps) => {
  const classes = useStyles();

  return (
    <Paper data-testid={testid} className={classes.main} square>
      <span>{text}</span>
      {deleteFav && (
        <IconButton
          data-testid="deleteFav"
          aria-label={`${text} entfernen`}
          onClick={deleteFav}
          color="inherit"
        >
          <ActionDelete />
        </IconButton>
      )}
    </Paper>
  );
};

const FavEntry = ({ fav, noDelete }: Props) => {
  const unfav = useUnfav();
  const deleteFav = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      unfav(fav);
    },
    [fav, unfav]
  );

  return (
    <Link
      data-testid="favEntry"
      to={encodeURIComponent(fav.title)}
      title={`Zugabfahrten für ${fav.title}`}
    >
      <FavEntryDisplay
        text={fav.title}
        deleteFav={noDelete ? undefined : deleteFav}
      />
    </Link>
  );
};

export default FavEntry;
