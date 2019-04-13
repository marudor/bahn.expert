// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { getAbfahrtenForConfig } from 'Abfahrten/selector/abfahrten';
import { Redirect } from 'react-router';
import Abfahrt from './Abfahrt';
import Actions, {
  getAbfahrtenByString,
  refreshCurrentAbfahrten,
} from 'Abfahrten/actions/abfahrten';
import Loading from './Loading';
import React from 'react';
import withStyles, { type StyledProps } from 'react-jss';
import type { AbfahrtenState, AppStore } from 'AppState';
import type { Match } from 'react-router';

type InnerAbfahrtenProps = {|
  abfahrten: $PropertyType<
    $PropertyType<AbfahrtenState, 'abfahrten'>,
    'abfahrten'
  >,
|};
type StateProps = {|
  ...InnerAbfahrtenProps,
  +currentStation: ?$PropertyType<
    $PropertyType<AbfahrtenState, 'abfahrten'>,
    'currentStation'
  >,
  +error: ?$PropertyType<$PropertyType<AbfahrtenState, 'abfahrten'>, 'error'>,
  +autoUpdate: number,
|};
const InnerAbfahrten = ({ abfahrten }: InnerAbfahrtenProps) =>
  abfahrten && abfahrten.length ? (
    abfahrten.map(a => a && <Abfahrt abfahrt={a} key={a.rawId} />)
  ) : (
    <div>Leider keine Abfahrten in nächster Zeit</div>
  );

type DispatchProps = {|
  +getAbfahrtenByString: typeof getAbfahrtenByString,
  +setCurrentStation: typeof Actions.setCurrentStation,
  +refreshCurrentAbfahrten: typeof refreshCurrentAbfahrten,
|};
type OwnProps = {||};

type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

type RouterProps = {|
  ...ReduxProps,
  ...ContextRouter,
|};

type Props = StyledProps<RouterProps, typeof styles>;
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
  abfahrtenInterval: IntervalID;
  componentDidMount() {
    const { currentStation, refreshCurrentAbfahrten, autoUpdate } = this.props;

    if (!currentStation) {
      this.getAbfahrten();
    }
    if (autoUpdate) {
      this.abfahrtenInterval = setInterval(
        refreshCurrentAbfahrten,
        autoUpdate * 1000
      );
    }
  }
  componentWillUnmount() {
    clearInterval(this.abfahrtenInterval);
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.station !== this.props.match.params.station) {
      this.getAbfahrten();
    }
  }
  getAbfahrten = async () => {
    const {
      getAbfahrtenByString,
      setCurrentStation,
      match,
      location,
    } = this.props;

    this.setState({ loading: true });
    setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: '0',
    });
    try {
      await getAbfahrtenByString(
        match.params.station,
        location.state?.searchType
      );
    } finally {
      this.setState({ loading: false });
    }
  };
  render() {
    const { loading } = this.state;
    const { abfahrten, error, currentStation, classes } = this.props;

    return (
      <Loading isLoading={loading}>
        <main className={classes.main}>
          {currentStation && <h1>Abfahrten für {currentStation.title}</h1>}
          {error ? (
            !loading && <Redirect to="/" />
          ) : (
            <InnerAbfahrten abfahrten={abfahrten} />
          )}
        </main>
      </Loading>
    );
  }
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
    marginTop: 64,
    '& > h1': {
      display: 'none',
    },
  },
};

export default connect<
  ReduxProps,
  OwnProps,
  StateProps,
  DispatchProps,
  AbfahrtenState,
  _
>(
  state => ({
    abfahrten: getAbfahrtenForConfig(state),
    currentStation: state.abfahrten.currentStation,
    error: state.abfahrten.error,
    autoUpdate: state.config.config.autoUpdate,
  }),
  {
    getAbfahrtenByString,
    setCurrentStation: Actions.setCurrentStation,
    refreshCurrentAbfahrten,
  }
)(withRouter(withStyles(styles)(AbfahrtenList)));
