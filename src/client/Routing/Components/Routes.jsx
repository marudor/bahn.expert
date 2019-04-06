// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import React from 'react';
import RouteList from './RouteList';
import routingActions, { getRoutes, getStationById } from 'Routing/actions/routing';
import StationSearch from 'Common/Components/StationSearch';
import type { RoutingState } from 'AppState';
import type { Station } from 'types/station';

type DispatchProps = {|
  setStart: typeof routingActions.setStart,
  setDestination: typeof routingActions.setDestination,
  getRoutes: typeof getRoutes,
  getStationById: typeof getStationById,
|};
type StateProps = {|
  start: ?Station,
  destination: ?Station,
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
    const { match, getStationById, getRoutes } = this.props;
    const { start, destination } = match.params;

    if (start) {
      getStationById(start, routingActions.setStart);
    }
    if (destination) {
      getStationById(destination, routingActions.setDestination);
    }
    if (start && destination) {
      getRoutes(start, destination);
    }
  }
  searchRoute = (e: SyntheticEvent<>) => {
    e.preventDefault();
    const { start, destination, getRoutes, history } = this.props;

    if (start && destination) {
      getRoutes(start.id, destination.id);
      history.push(`/routing/${start.id}/${destination.id}`);
    }
  };
  render() {
    const { start, setStart, destination, setDestination } = this.props;

    return (
      <div>
        <StationSearch searchType="dbNav" value={start} onChange={setStart} placeholder="Start" />
        <StationSearch searchType="dbNav" value={destination} onChange={setDestination} placeholder="Destination" />
        <Button variant="contained" onClick={this.searchRoute}>
          Search
        </Button>
        <div style={{ marginBottom: '1em' }} />
        <RouteList />
      </div>
    );
  }
}

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, RoutingState, _>(
  state => ({
    start: state.routing.start,
    destination: state.routing.destination,
  }),
  {
    setStart: routingActions.setStart,
    setDestination: routingActions.setDestination,
    getStationById,
    getRoutes,
  }
)(withRouter(Routing));
