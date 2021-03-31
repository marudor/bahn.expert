import { Delete } from '@material-ui/icons';
import { IconButton, makeStyles, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useAbfahrtenUrlPrefix } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback } from 'react';
import { useUnfav } from 'client/Abfahrten/provider/FavProvider';
import clsx from 'clsx';
import type { FC, MouseEvent, ReactNode } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';

const useStyles = makeStyles((theme) => ({
  wrap: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    fontSize: '1.6em',
    padding: '0 .5em',
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    '&>a': {
      color: theme.palette.text.primary,
    },
  },
  clickable: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    justifyContent: 'space-between',
  },
  unClickable: {
    fontWeight: 600,
    justifyContent: 'center',
  },
}));

interface Props {
  fav: MinimalStopPlace;
  noDelete?: boolean;
  'data-testid'?: string;
}

interface FavEntryDisplayProps {
  deleteFav?: (e: MouseEvent) => void;
  text: ReactNode;
  'data-testid'?: string;
  clickable?: boolean;
}
export const FavEntryDisplay: FC<FavEntryDisplayProps> = ({
  deleteFav,
  text,
  clickable = true,
  'data-testid': testid,
}) => {
  const classes = useStyles();
  return (
    <Paper
      className={clsx(
        classes.wrap,
        clickable ? classes.clickable : classes.unClickable,
      )}
      data-testid={testid}
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
          <Delete />
        </IconButton>
      )}
    </Paper>
  );
};

export const FavEntry: FC<Props> = ({
  fav,
  noDelete,
  'data-testid': testid = 'favEntry',
}) => {
  const urlPrefix = useAbfahrtenUrlPrefix();
  const unfav = useUnfav();
  const deleteFav = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      unfav(fav);
    },
    [fav, unfav],
  );

  return (
    <Link
      data-testid={testid}
      to={`${urlPrefix}${encodeURIComponent(fav.name)}`}
      title={`Zugabfahrten für ${fav.name}`}
    >
      <FavEntryDisplay
        text={fav.name}
        deleteFav={noDelete ? undefined : deleteFav}
      />
    </Link>
  );
};
