import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import { Station } from 'types/station';
import { unfav } from 'Abfahrten/actions/fav';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React, { MouseEvent, useCallback } from 'react';

type OwnProps = {
  fav: Station;
  noDelete?: boolean;
};
type DispatchProps = ResolveThunks<{
  unfav: typeof unfav;
}>;
type ReduxProps = OwnProps & DispatchProps;

type Props = ReduxProps & WithStyles<typeof styles>;

const FavEntry = ({ fav, noDelete, classes, unfav }: Props) => {
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
      to={encodeURIComponent(fav.title)}
      title={`Zugabfahrten für ${fav.title}`}
    >
      <Paper className={classes.main} square>
        <span>{fav.title}</span>
        {!noDelete && (
          <IconButton
            aria-label={`${fav.title} entfernen`}
            onClick={deleteFav}
            color="inherit"
          >
            <ActionDelete />
          </IconButton>
        )}
      </Paper>
    </Link>
  );
};

export const styles = createStyles(theme => ({
  main: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    paddingLeft: '.5em',
    fontSize: '2em',
    paddingRight: '.5em',
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > a': {
      color: theme.palette.text.primary,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default connect<void, DispatchProps, OwnProps, AbfahrtenState>(
  undefined,
  {
    unfav,
  }
)(withStyles(styles)(FavEntry));
