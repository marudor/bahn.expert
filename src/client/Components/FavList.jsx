// @flow
import './FavList.scss';
import { Actions } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { sortedFavValues } from 'client/selector/fav';
import FavEntry from './FavEntry';
import React from 'react';
import type { AppState } from 'AppState';
import type { Station } from 'types/abfahrten';

type DispatchProps = {|
  setCurrentStation: typeof Actions.setCurrentStation,
|};
type StateProps = {|
  favs: Station[],
|};
type Props = {|
  ...StateProps,
  ...DispatchProps,
|};

const mostUsed = [
  { title: 'Hannover Hbf', id: '8000152' },
  { title: 'Wuppertal Hbf', id: '8000266' },
  { title: 'Düsseldorf Hbf', id: '8000085' },
  { title: 'Hamburg Hbf', id: '8002549' },
  { title: 'Kempen (Niederrhein)', id: '8000409' },
  { title: 'Frankfurt (Main) Hbf', id: '8000105' },
  { title: 'Rheda-Wiedenbrück', id: '8000315' },
  { title: 'Braunschweig Hbf', id: '8000049' },
  { title: 'Köln Hbf', id: '8000207' },
  { title: 'Wolfsburg Hbf', id: '8006552' },
  { title: 'Opladen', id: '8000853' },
  { title: 'Mannheim Hbf', id: '8000244' },
  { title: 'Berlin-Spandau', id: '8010404' },
  { title: 'Duisburg Hbf', id: '8000086' },
  { title: 'München Hbf', id: '8000261' },
];

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
          <>
            <span className="FavEntry">Keine Favoriten</span>
            <span className="FavEntry">Oft gesucht:</span>
            {mostUsed.map(m => (
              <FavEntry noDelete key={m.id} fav={m} />
            ))}
          </>
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
    setCurrentStation: Actions.setCurrentStation,
  }
)(FavList);
