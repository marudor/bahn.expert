import { Link } from 'react-router-dom';
import { MouseEvent, ReactNode, useCallback } from 'react';
import { Paper } from '@material-ui/core';
import { Station } from 'types/station';
import { useUnfav } from 'Abfahrten/container/FavContainer';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import ActionDelete from '@material-ui/icons/Delete';
import cc from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './FavEntry.style';

interface Props {
  fav: Station;
  noDelete?: boolean;
  'data-testid'?: string;
}

interface FavEntryDisplayProps {
  deleteFav?: (e: MouseEvent) => void;
  text: ReactNode;
  'data-testid'?: string;
  clickable?: boolean;
}
export const FavEntryDisplay = ({
  deleteFav,
  text,
  clickable = true,
  'data-testid': testid,
}: FavEntryDisplayProps) => {
  const classes = useStyles();

  return (
    <Paper
      data-testid={testid}
      className={cc(
        classes.main,
        clickable ? classes.clickable : classes.nonClickable
      )}
      square
    >
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

const FavEntry = ({
  fav,
  noDelete,
  'data-testid': testid = 'favEntry',
}: Props) => {
  const { urlPrefix } = AbfahrtenConfigContainer.useContainer();
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
      data-testid={testid}
      to={`${urlPrefix}${encodeURIComponent(fav.title)}`}
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
