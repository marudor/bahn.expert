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
  selectedDetail: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'selectedDetail'>,
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  error: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'error'>,
|};
const InnerAbfahrten = ({ abfahrten }: InnerAbfahrtenProps) =>
  abfahrten && abfahrten.length ? (
    abfahrten.map(a => a && <Abfahrt abfahrt={a} key={a.rawId} />)
  ) : (
    <div className="FavEntry">Leider keine Abhfarten in nächster Zeit</div>
  );

type DispatchProps = {|
  getAbfahrtenByString: typeof getAbfahrtenByString,
  setCurrentStation: typeof Actions.setCurrentStation,
|};

type OwnProps = {|
  ...ContextRouter,
|};

type Props = {|
  ...StateProps,
  ...DispatchProps,
  ...OwnProps,
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
    } else {
      this.scrollToDetail();
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.station !== this.props.match.params.station) {
      this.getAbfahrten();
    }
  }
  scrollToDetail = () => {
    const { selectedDetail } = this.props;

    if (selectedDetail) {
      const detailDom = document.getElementById(selectedDetail);

      if (detailDom) {
        const scrollIntoView = () => setTimeout(() => detailDom.scrollIntoView(false));

        if (document.readyState === 'complete') {
          scrollIntoView();
        } else {
          window.addEventListener('load', scrollIntoView);
        }
      }
    }
  };
  getAbfahrten = async () => {
    const { getAbfahrtenByString, setCurrentStation, match } = this.props;

    this.setState({ loading: true });
    setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: '0',
    });
    try {
      await getAbfahrtenByString(match.params.station);
    } finally {
      this.setState({ loading: false }, this.scrollToDetail);
    }
  };
  render() {
    const { loading } = this.state;
    const { abfahrten, error } = this.props;

    return (
      <Loading isLoading={loading}>
        <main className="AbfahrtenList">
          {error ? !loading && <Redirect to="/" /> : <InnerAbfahrten abfahrten={abfahrten} />}
        </main>
      </Loading>
    );
  }
}

export default withRouter(
  connect<AppState, Function, OwnProps, StateProps, DispatchProps>(
    state => ({
      abfahrten: state.abfahrten.abfahrten,
      selectedDetail: state.abfahrten.selectedDetail,
      currentStation: state.abfahrten.currentStation,
      error: state.abfahrten.error,
    }),
    {
      getAbfahrtenByString,
      setCurrentStation: Actions.setCurrentStation,
    }
  )(AbfahrtenList)
);
