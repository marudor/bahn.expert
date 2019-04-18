import { AppStore, RoutingState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getRoutes } from 'Routing/actions/routing';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import RouteList from './RouteList';
import Search from './Search';
import searchActions from 'Routing/actions/search';

type DispatchProps = ResolveThunks<{
  getRoutes: typeof getRoutes;
}>;
type StateProps = {
  date: Date;
  dateTouched?: boolean;
};
type Props = DispatchProps &
  StateProps &
  RouteComponentProps<{
    start?: string;
    destination?: string;
  }>;
class Routing extends React.PureComponent<Props> {
  static loadData = (store: AppStore) => {
    store.dispatch(searchActions.setDate(new Date(), false));
  };
  componentDidMount() {
    const { match, getRoutes, date, dateTouched } = this.props;
    const { start, destination } = match.params;

    if (start && destination && date && dateTouched) {
      getRoutes(start, destination, date);
    }
  }
  render() {
    return (
      <div>
        <Search />
        <div style={{ marginBottom: '1em' }} />
        <RouteList />
      </div>
    );
  }
}

export default connect<StateProps, DispatchProps, {}, RoutingState>(
  state => ({
    date: state.search.date,
    dateTouched: state.search.dateTouched,
  }),
  {
    getRoutes,
  }
)(withRouter(Routing));
