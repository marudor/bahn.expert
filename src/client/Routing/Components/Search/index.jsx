// @flow
import { connect } from 'react-redux';
import { type ContextRouter, withRouter } from 'react-router-dom';
import { getRoutes } from 'Routing/actions/routing';
import Button from '@material-ui/core/Button';
import React from 'react';
import searchActions, { getStationById } from 'Routing/actions/search';
import StationSearch from 'Common/Components/StationSearch';
// import TextField from '@material-ui/core/TextField';
import type { RoutingState } from 'AppState';
import type { Station } from 'types/station';

type DispatchProps = {|
  getStationById: typeof getStationById,
  setStart: typeof searchActions.setStart,
  setDestination: typeof searchActions.setDestination,
  getRoutes: typeof getRoutes,
  setDate: typeof searchActions.setDate,
  setTime: typeof searchActions.setTime,
|};
type OwnProps = {||};
type StateProps = {|
  start: ?Station,
  destination: ?Station,
  date: string,
  time: string,
|};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = {|
  ...ReduxProps,
  ...ContextRouter,
|};

class Search extends React.PureComponent<Props> {
  componentDidMount() {
    const { match, getStationById } = this.props;
    const { start, destination } = match.params;

    if (start) {
      getStationById(start, searchActions.setStart);
    }
    if (destination) {
      getStationById(destination, searchActions.setDestination);
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
  onDateChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.props.setDate(e.currentTarget.value);
  };
  onTimeChange = (e: SyntheticEvent<HTMLInputElement>) => {
    this.props.setTime(e.currentTarget.value);
  };
  render() {
    const { start, destination, setStart, setDestination /* , date, time*/ } = this.props;

    return (
      <>
        <StationSearch searchType="dbNav" value={start} onChange={setStart} placeholder="Start" />
        <StationSearch searchType="dbNav" value={destination} onChange={setDestination} placeholder="Destination" />
        {/* <TextField
          label="date"
          InputLabelProps={{
            shrink: true,
          }}
          type="date"
          value={date}
          onChange={this.onDateChange}
        /> */}
        {/* <TextField type="time" value={time} onChange={this.onTimeChange} /> */}
        <Button fullWidth variant="contained" onClick={this.searchRoute}>
          Search
        </Button>
      </>
    );
  }
}

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, RoutingState, _>(
  state => ({
    start: state.search.start,
    destination: state.search.destination,
    date: state.search.date,
    time: state.search.time,
  }),
  {
    getStationById,
    setStart: searchActions.setStart,
    setDestination: searchActions.setDestination,
    getRoutes,
    setDate: searchActions.setDate,
    setTime: searchActions.setTime,
  }
)(withRouter(Search));
