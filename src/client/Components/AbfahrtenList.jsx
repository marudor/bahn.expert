// @flow
import './AbfahrtenList.scss';
import { Actions, getAbfahrtenByString } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import Abfahrt from './Abfahrt';
import Loading from './Loading';
import MostUsed from './MostUsed';
import React from 'react';
import type { AppState } from 'AppState';

type StateProps = {|
  abfahrten: $PropertyType<$PropertyType<AppState, 'abfahrten'>, 'abfahrten'>,
  currentStation: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'currentStation'>,
  selectedDetail: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'selectedDetail'>,
  error: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'error'>,
|};

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

function getErrorText(error: any, staticContext) {
  switch (error.type) {
    case 'redirect':
      return <Redirect to={error.redirect} />;
    case '404':
      if (staticContext) {
        // $FlowFixMe
        staticContext.status = 404;
      }

      return 'Die Abfahrt existiert nicht';
    default:
      if (error.response?.data?.error) {
        return error.response.data.error;
      }

      return 'Unbekannter Fehler';
  }
}

class AbfahrtenList extends React.PureComponent<Props, State> {
  static loadData = (store, match) => {
    store.dispatch(
      Actions.setCurrentStation({
        title: decodeURIComponent(match.params.station || ''),
        id: 0,
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
        detailDom.scrollIntoView(false);
      }
    }
  };
  getAbfahrten = async () => {
    const { getAbfahrtenByString, setCurrentStation, match } = this.props;

    this.setState({ loading: true });
    setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: 0,
    });
    try {
      await getAbfahrtenByString(match.params.station);
    } finally {
      this.setState({ loading: false }, this.scrollToDetail);
    }
  };
  render() {
    const { loading } = this.state;
    const { abfahrten, selectedDetail, error, staticContext } = this.props;

    return (
      <Loading isLoading={loading}>
        <div className="AbfahrtenList">
          {error ? (
            <>
              <div className="FavEntry">{getErrorText(error, staticContext)}</div>
              <div className="FavEntry">Versuch einen der folgenden</div>
              <MostUsed />
            </>
          ) : (
            abfahrten.map(a => a && <Abfahrt abfahrt={a} detail={selectedDetail === a.id} key={a.id} />)
          )}
        </div>
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
