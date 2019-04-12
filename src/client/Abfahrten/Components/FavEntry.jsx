// @flow
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { unfav } from 'Abfahrten/actions/fav';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState } from 'AppState';
import type { Station } from 'types/station';

type OwnProps = {|
  +fav: Station,
  +noDelete?: boolean,
|};
type DispatchProps = {|
  +unfav: typeof unfav,
|};
type ReduxProps = {|
  ...OwnProps,
  ...DispatchProps,
|};

type Props = StyledProps<ReduxProps, typeof styles>;
class FavEntry extends React.PureComponent<Props> {
  deleteFav = (e: SyntheticMouseEvent<>) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.unfav(this.props.fav);
  };
  render() {
    const { fav, noDelete, classes } = this.props;

    return (
      <Link to={encodeURIComponent(fav.title)} title={`Zugabfahrten für ${fav.title}`}>
        <div className={classes.main}>
          <span>{fav.title}</span>
          {!noDelete && (
            <IconButton aria-label={`${fav.title} entfernen`} onClick={this.deleteFav} color="inherit">
              <ActionDelete />
            </IconButton>
          )}
        </div>
      </Link>
    );
  }
}

export const styles = {
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
};

export default connect<ReduxProps, OwnProps, _, DispatchProps, AbfahrtenState, _>(
  undefined,
  {
    unfav,
  }
)(withStyles(styles)(FavEntry));
