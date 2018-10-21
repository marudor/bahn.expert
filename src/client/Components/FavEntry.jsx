// @flow
import './FavEntry.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { unfav } from 'client/actions/fav';
import ActionDelete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import type { Station } from 'types/abfahrten';

type Props = {
  fav: Station,
  unfav: typeof unfav,
};
class FavEntry extends React.PureComponent<Props> {
  deleteFav = () => {
    this.props.unfav(this.props.fav);
  };
  render() {
    const { fav } = this.props;

    return (
      <div className="FavEntry">
        <Link to={encodeURIComponent(fav.title)}>
          <span>{fav.title}</span>
        </Link>
        <IconButton onClick={this.deleteFav} color="inherit">
          <ActionDelete />
        </IconButton>
      </div>
    );
  }
}

export default connect(
  undefined,
  {
    unfav,
  }
)(FavEntry);
