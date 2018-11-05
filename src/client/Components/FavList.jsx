// @flow
import './FavList.scss';
import { connect } from 'react-redux';
import { setCurrentStation } from 'client/actions/abfahrten';
import { sortedFavValues } from 'client/selector/fav';
import FavEntry from './FavEntry';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type DispatchProps = {|
  setCurrentStation: typeof setCurrentStation,
|};
type StateProps = {|
  favs: Station[],
|};
type Props = {|
  ...StateProps,
  ...DispatchProps,
|};

class FavList extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.setCurrentStation(null);
  }
  render() {
    const { favs } = this.props;

    return (
      <div className="FavList">
        {favs.length ? (
          favs.map(fav => fav && <FavEntry key={fav.id} fav={fav} />)
        ) : (
          <span className="FavEntry">Bisher hast du keine Favoriten.</span>
        )}
      </div>
    );
  }
}

export default connect<AppState, Function, void, StateProps, DispatchProps>(
  state => ({
    favs: sortedFavValues(state),
  }),
  {
    setCurrentStation,
  }
)(FavList);
