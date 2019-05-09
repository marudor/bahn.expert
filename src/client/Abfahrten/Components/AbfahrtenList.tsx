import { AbfahrtenState, AppStore } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Departures } from 'types/abfahrten';
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
import Loading from 'Common/Components/Loading';
import React from 'react';

type InnerAbfahrtenProps = {
  abfahrten?: Departures;
  classes: Record<'lookahead' | 'lookbehind' | 'lookaheadMarker', string>;
};
type StateProps = {
  abfahrten?: Departures;
  currentStation?: Station;
  error?: AbfahrtenError;
  autoUpdate: number;
  selectedDetail?: string;
};
const InnerAbfahrten = ({ abfahrten, classes }: InnerAbfahrtenProps) =>
  abfahrten && (abfahrten.lookahead.length || abfahrten.lookbehind.length) ? (
    <>
      {Boolean(abfahrten.lookbehind.length) && (
        <div id="lookbehind" className={classes.lookbehind}>
          {abfahrten.lookbehind.map(
            a => a && <Abfahrt abfahrt={a} key={a.rawId} />
          )}
          <div className={classes.lookaheadMarker} id="lookaheadMarker" />
        </div>
      )}
      <div id="lookahead" className={classes.lookahead}>
        {abfahrten.lookahead.map(
          a => a && <Abfahrt abfahrt={a} key={a.rawId} />
        )}
      </div>
    </>
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
  scrolled: boolean;
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
    scrolled: false,
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
    this.checkScroll();
  }
  componentWillUnmount() {
    if (this.abfahrtenInterval) {
      clearInterval(this.abfahrtenInterval);
    }
  }
  checkScroll() {
    const { abfahrten, selectedDetail } = this.props;

    if (this.state.scrolled) return;

    if (abfahrten) {
      let scrollDom: HTMLElement | null = null;

      if (selectedDetail) {
        scrollDom = document.getElementById(`${selectedDetail}Scroll`);
      }
      if (!scrollDom && abfahrten.lookbehind.length) {
        scrollDom = document.getElementById('lookaheadMarker');
      }
      if (scrollDom) {
        const scrollIntoView = () =>
          setTimeout(() => scrollDom && scrollDom.scrollIntoView());

        if (document.readyState === 'complete') {
          scrollIntoView();
        } else {
          window.addEventListener('load', scrollIntoView);
        }
      }
      this.setState({
        scrolled: true,
      });
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.station !== this.props.match.params.station) {
      this.getAbfahrten();
    }
    this.checkScroll();
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
      this.setState({ loading: false, scrolled: false });
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
            <InnerAbfahrten classes={classes} abfahrten={abfahrten} />
          )}
        </main>
      </Loading>
    );
  }
}

const styles = createStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
    marginTop: 64,
    '& > h1': {
      display: 'none',
    },
  },

  lookaheadMarker: {
    height: 154,
    position: 'absolute',
    bottom: 0,
  },

  lookahead: {},

  lookbehind: {
    position: 'relative',
    paddingTop: 10,
    backgroundColor: theme.colors.shadedBackground,
  },
}));

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    abfahrten: getAbfahrtenForConfig(state),
    currentStation: state.abfahrten.currentStation,
    error: state.abfahrten.error,
    autoUpdate: state.abfahrtenConfig.config.autoUpdate,
    selectedDetail: state.abfahrten.selectedDetail,
  }),
  {
    getAbfahrtenByString,
    setCurrentStation: Actions.setCurrentStation,
    refreshCurrentAbfahrten,
  }
)(withRouter(withStyles(styles)(AbfahrtenList)));
