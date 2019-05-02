import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
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
      <div className={classes.main}>
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
      </div>
    </Link>
  );
};

export const styles = createStyles({
  main: {
    minHeight: 48,
    marginBottom: 1,
    flexShrink: 0,
    fontSize: '2em',
    color: 'black',
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > a': {
      color: 'black',
    },
    '&:hover': {
      backgroundColor: 'rgb(238,238,238)',
    },
  },
});

export default connect<void, DispatchProps, OwnProps, AbfahrtenState>(
  undefined,
  {
    unfav,
  }
)(withStyles(styles)(FavEntry));
