import { AbfahrtenState, AppStore } from 'AppState';
import { Abfahrt as AbfahrtType } from 'types/abfahrten';
import { connect, ResolveThunks } from 'react-redux';
import { getAbfahrtenForConfig } from 'Abfahrten/selector/abfahrten';
import { match } from 'react-router';
import { Redirect } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Station } from 'types/station';
import Abfahrt from './Abfahrt';
import Actions, {
  AbfahrtenError,
  getAbfahrtenByString,
  refreshCurrentAbfahrten,
} from 'Abfahrten/actions/abfahrten';
import Loading from './Loading';
import React from 'react';
import withStyles, { WithStyles } from 'react-jss';

type InnerAbfahrtenProps = {
  abfahrten?: Array<AbfahrtType>;
};
type StateProps = InnerAbfahrtenProps & {
  currentStation?: Station;
  error?: AbfahrtenError;
  autoUpdate: number;
};
const InnerAbfahrten = ({ abfahrten }: InnerAbfahrtenProps) =>
  abfahrten && abfahrten.length ? (
    <>{abfahrten.map(a => a && <Abfahrt abfahrt={a} key={a.rawId} />)}</>
  ) : (
    <div>Leider keine Abfahrten in nächster Zeit</div>
  );

type DispatchProps = ResolveThunks<{
  getAbfahrtenByString: typeof getAbfahrtenByString;
  setCurrentStation: typeof Actions.setCurrentStation;
  refreshCurrentAbfahrten: typeof refreshCurrentAbfahrten;
}>;

type ReduxProps = StateProps & DispatchProps;

type Props = ReduxProps &
  RouteComponentProps<{ station: string }> &
  WithStyles<typeof styles>;
type State = {
  loading: boolean;
};

class AbfahrtenList extends React.PureComponent<Props, State> {
  static loadData = (store: AppStore, match: match<{ station: string }>) => {
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
  abfahrtenInterval?: NodeJS.Timeout;
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
    if (this.abfahrtenInterval) {
      clearInterval(this.abfahrtenInterval);
    }
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
        location.state && location.state.searchType
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

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
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
