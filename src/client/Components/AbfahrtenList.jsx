// @flow
import './AbfahrtenList.scss';
import { Actions, getAbfahrtenByString } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Abfahrt from './Abfahrt';
import Loading from './Loading';
import React from 'react';
import type { AppState, AppStore } from 'AppState';
import type { Match } from 'react-router';

type InnerAbfahrtenProps = {|
  abfahrten: $PropertyType<$PropertyType<AppState, 'abfahrten'>, 'abfahrten'>,
|};
type StateProps = {|
  ...InnerAbfahrtenProps,
  +currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  +error: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'error'>,
|};
const InnerAbfahrten = ({ abfahrten }: InnerAbfahrtenProps) =>
  abfahrten && abfahrten.length ? (
    abfahrten.map(a => a && <Abfahrt abfahrt={a} key={a.rawId} />)
  ) : (
    <div className="FavEntry">Leider keine Abhfarten in nächster Zeit</div>
  );

type DispatchProps = {|
  +getAbfahrtenByString: typeof getAbfahrtenByString,
  +setCurrentStation: typeof Actions.setCurrentStation,
|};

type OwnProps = {||};

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
  ...ContextRouter,
|};

type State = {
  loading: boolean,
};

class AbfahrtenList extends React.PureComponent<Props, State> {
  static loadData = (store: AppStore, match: Match) => {
    store.dispatch(
      Actions.setCurrentStation({
        title: decodeURIComponent(match.params.station || ''),
        id: '0',
      })
    );

    return store.dispatch(getAbfahrtenByString(match.params.station));
  };
  state: State = {
    loading: !this.props.abfahrten,
  };
  componentDidMount() {
    if (!this.props.currentStation) {
      this.getAbfahrten();
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.station !== this.props.match.params.station) {
      this.getAbfahrten();
    }
  }
  getAbfahrten = async () => {
    const { getAbfahrtenByString, setCurrentStation, match, location } = this.props;

    this.setState({ loading: true });
    setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: '0',
    });
    try {
      await getAbfahrtenByString(match.params.station, location.state?.searchType);
    } finally {
      this.setState({ loading: false });
    }
  };
  render() {
    const { loading } = this.state;
    const { abfahrten, error, currentStation } = this.props;

    return (
      <Loading isLoading={loading}>
        <main className="AbfahrtenList">
          {currentStation && <h1>Abfahrten für {currentStation.title}</h1>}
          {error ? !loading && <Redirect to="/" /> : <InnerAbfahrten abfahrten={abfahrten} />}
        </main>
      </Loading>
    );
  }
}

export default connect<_, *, StateProps, DispatchProps, AppState, _>(
  state => ({
    abfahrten: state.abfahrten.abfahrten,
    currentStation: state.abfahrten.currentStation,
    error: state.abfahrten.error,
  }),
  {
    getAbfahrtenByString,
    setCurrentStation: Actions.setCurrentStation,
  }
)(withRouter(AbfahrtenList));
