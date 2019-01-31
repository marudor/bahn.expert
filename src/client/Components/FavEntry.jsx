// @flow
import './FavEntry.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { unfav } from 'client/actions/fav';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type OwnProps = {|
  fav: Station,
  noDelete?: boolean,
|};
type DispatchProps = {|
  unfav: typeof unfav,
|};
type Props = {|
  ...OwnProps,
  ...DispatchProps,
|};
class FavEntry extends React.PureComponent<Props> {
  deleteFav = (e: SyntheticMouseEvent<>) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.unfav(this.props.fav);
  };
  render() {
    const { fav, noDelete } = this.props;

    return (
      <Link to={encodeURIComponent(fav.title)}>
        <div className="FavEntry">
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

export default connect<AppState, Function, OwnProps, void, DispatchProps>(
  undefined,
  {
    unfav,
  }
)(FavEntry);
