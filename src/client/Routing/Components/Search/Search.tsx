import {
  addDays,
  endOfDay,
  isSameDay,
  isSameYear,
  isWithinInterval,
  lightFormat,
  startOfDay,
  subDays,
} from 'date-fns';
import { connect, ResolveThunks } from 'react-redux';
import { DateTimePicker } from 'material-ui-pickers';
import { getRoutes } from 'Routing/actions/routing';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RoutingState } from 'AppState';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import { withStyles, WithStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import deLocale from 'date-fns/locale/de';
import IconButton from '@material-ui/core/IconButton';
import React, { SyntheticEvent } from 'react';
import searchActions, { getStationById } from 'Routing/actions/search';
import StationSearch from 'Common/Components/StationSearch';
import styles from './Search.styles';
import SwapVertical from '@material-ui/icons/SwapVert';

type DispatchProps = ResolveThunks<{
  getStationById: typeof getStationById;
  setStart: typeof searchActions.setStart;
  setDestination: typeof searchActions.setDestination;
  getRoutes: typeof getRoutes;
  setDate: typeof searchActions.setDate;
}>;
type StateProps = {
  start?: Station;
  destination?: Station;
  date: Date;
};
type ReduxProps = DispatchProps & StateProps;
type Props = ReduxProps &
  WithSnackbarProps &
  RouteComponentProps<{
    start?: string;
    destination?: string;
  }> &
  WithStyles<typeof styles>;

const formatDate = (date: Date) => {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(addDays(today, 1));
  const yesterday = subDays(today, 1);

  let relativeDayString = '';

  if (isWithinInterval(date, { start: yesterday, end: tomorrow })) {
    if (isSameDay(date, today)) relativeDayString = 'Heute';
    else if (isSameDay(date, yesterday)) relativeDayString = 'Gestern';
    else if (isSameDay(date, tomorrow)) relativeDayString = 'Morgen';
    relativeDayString += `, ${deLocale.localize.day(date.getDay(), {
      width: 'short',
    })}`;
  } else {
    relativeDayString = deLocale.localize.day(date.getDay());
  }
  relativeDayString += ` ${lightFormat(date, 'dd.MM.')}`;
  if (!isSameYear(date, today)) {
    relativeDayString += lightFormat(date, 'yyyy');
  }
  relativeDayString += ` ${lightFormat(date, 'HH:mm')}`;

  return relativeDayString;
};

class Search extends React.PureComponent<Props> {
  startReqId = 'startRequired';
  destReqId = 'destRequired';
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
  searchRoute = (e: SyntheticEvent) => {
    e.preventDefault();
    const {
      start,
      destination,
      getRoutes,
      history,
      date,
      enqueueSnackbar,
      closeSnackbar,
    } = this.props;

    if (start && destination) {
      closeSnackbar(this.startReqId);
      closeSnackbar(this.destReqId);
      getRoutes(start.id, destination.id, date);
      history.push(`/routing/${start.id}/${destination.id}`);
    } else {
      if (!destination) {
        enqueueSnackbar('Ziel ist required.', {
          autoHideDuration: 5000,
          variant: 'error',
          key: this.destReqId,
        });
      }
      if (!start) {
        enqueueSnackbar('Start ist required.', {
          autoHideDuration: 5000,
          variant: 'error',
          key: this.startReqId,
        });
      }
    }
  };
  goHome = () => {
    this.props.history.push('/');
  };
  render() {
    const {
      start,
      destination,
      setStart,
      setDestination,
      date,
      setDate,
      classes,
    } = this.props;

    return (
      <>
        <StationSearch
          searchType={StationSearchType.DBNavgiator}
          value={start}
          onChange={setStart}
          placeholder="Start"
        />
        <div className={classes.destination}>
          <StationSearch
            searchType={StationSearchType.DBNavgiator}
            value={destination}
            onChange={setDestination}
            placeholder="Destination"
          />
          <IconButton
            style={{ padding: 0 }}
            onClick={(e: SyntheticEvent) => {
              e.preventDefault();
              e.stopPropagation();
              setDestination(start);
              setStart(destination);
            }}
          >
            <SwapVertical fontSize="large" />
          </IconButton>
        </div>
        <DateTimePicker
          fullWidth
          className={classes.datePicker}
          openTo="hours"
          labelFunc={formatDate}
          ampm={false}
          showTodayButton
          value={date}
          onChange={setDate}
          cancelLabel="Abbrechen"
          autoOk
          todayLabel="Jetzt"
          minutesStep={5}
        />
        <div className={classes.buttons}>
          <Button fullWidth variant="contained" onClick={this.searchRoute}>
            Search
          </Button>
          <Button variant="contained" onClick={this.goHome}>
            Home
          </Button>
        </div>
      </>
    );
  }
}

export default connect<StateProps, DispatchProps, {}, RoutingState>(
  state => ({
    start: state.search.start,
    destination: state.search.destination,
    date: state.search.date,
  }),
  {
    getStationById,
    setStart: searchActions.setStart,
    setDestination: searchActions.setDestination,
    getRoutes,
    setDate: searchActions.setDate,
  }
)(withRouter(withSnackbar(withStyles(styles)(Search))));
