// @flow
import './AbfahrtenList.scss';
import { connect } from 'react-redux';
import { getAbfahrtenByString, setCurrentStation } from 'actions/abfahrten';
import Abfahrt from './Abfahrt';
import Loading from './Loading';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import type { AppState } from 'AppState';
import type { ContextRouter } from 'react-router';

type ReduxProps = {|
  abfahrten: $PropertyType<$PropertyType<AppState, 'abfahrten'>, 'abfahrten'>,
  selectedDetail: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'selectedDetail'>,
  error: ?$PropertyType<$PropertyType<AppState, 'abfahrten'>, 'error'>,
  searchType: string,
|};

type Props = ReduxProps &
  ContextRouter & {|
    getAbfahrtenByString: typeof getAbfahrtenByString,
    setCurrentStation: typeof setCurrentStation,
  |};
type State = {
  loading: boolean,
};

function getErrorText(error: any) {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
}

class AbfahrtenList extends React.PureComponent<Props, State> {
  state: State = {
    loading: true,
  };
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };
  componentDidMount() {
    this.getAbfahrten();
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.station !== this.props.match.params.station) {
      this.getAbfahrten();
    }
  }
  getAbfahrten = async () => {
    const { getAbfahrtenByString, setCurrentStation, match, selectedDetail, searchType } = this.props;

    this.setState({ loading: true });
    setCurrentStation({
      title: decodeURIComponent(match.params.station || ''),
      id: 0,
    });
    try {
      await getAbfahrtenByString(match.params.station, searchType);
    } finally {
      this.setState({ loading: false }, () => {
        if (selectedDetail) {
          const detailDom = document.getElementById(selectedDetail);

          if (detailDom) {
            detailDom.scrollIntoView(false);
          }
        }
      });
    }
  };
  render() {
    const { loading } = this.state;
    const { abfahrten, selectedDetail, error } = this.props;

    return (
      <Loading isLoading={loading}>
        <div className="AbfahrtenList">
          {error ? (
            <Paper className="FavEntry__fav" onClick={this.getAbfahrten}>
              <Typography variant="display2" className="FavEntry__station">
                {getErrorText(error)}
              </Typography>
            </Paper>
          ) : (
            abfahrten.map(a => a && <Abfahrt abfahrt={a} detail={selectedDetail === a.id} key={a.id} />)
          )}
        </div>
      </Loading>
    );
  }
}

export default connect(
  (state: AppState): ReduxProps => ({
    abfahrten: state.abfahrten.abfahrten,
    selectedDetail: state.abfahrten.selectedDetail,
    error: state.abfahrten.error,
    searchType: state.config.searchType,
  }),
  {
    getAbfahrtenByString,
    setCurrentStation,
  }
)(AbfahrtenList);
