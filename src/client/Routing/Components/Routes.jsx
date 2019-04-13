// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { getRoutes } from 'Routing/actions/routing';
import React from 'react';
import RouteList from './RouteList';
import Search from './Search';
import type { RoutingState } from 'AppState';

type DispatchProps = {|
  getRoutes: typeof getRoutes,
|};
type StateProps = {|
  date: Date,
  dateTouched: *,
|};
type OwnProps = {||};
type ReduxProps = {|
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
|};
type Props = {|
  ...ReduxProps,
  ...ContextRouter,
|};
class Routing extends React.PureComponent<Props> {
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

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, RoutingState, _>(
  state => ({
    date: state.search.date,
    dateTouched: state.search.dateTouched,
  }),
  {
    getRoutes,
  }
)(withRouter(Routing));
