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
import { DateTimePicker } from '@material-ui/pickers';
import { getRoutes } from 'Routing/actions/routing';
import { shallowEqual, useDispatch } from 'react-redux';
import { StationSearchType } from 'Common/config';
import { useRouter } from 'useRouter';
import { useRoutingSelector } from 'useSelector';
import Button from '@material-ui/core/Button';
import deLocale from 'date-fns/locale/de';
import IconButton from '@material-ui/core/IconButton';
import React, { SyntheticEvent, useCallback, useEffect } from 'react';
import searchActions, { getStationById } from 'Routing/actions/search';
import SettingsPanel from './SettingsPanel';
import StationSearch from 'Common/Components/StationSearch';
import SwapVertical from '@material-ui/icons/SwapVert';
import useStyles from './Search.styles';

const Search = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { start, destination, date, routes, dateTouched } = useRoutingSelector(
    state => ({
      start: state.search.start,
      destination: state.search.destination,
      date: state.search.date,
      routes: state.routing.routes || [],
      dateTouched: state.search.dateTouched,
    }),
    shallowEqual
  );

  const { match, history } = useRouter<{
    start?: string;
    destination?: string;
  }>();

  const formatDate = useCallback((date: null | Date) => {
    if (!date) {
      return '';
    }
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
  }, []);

  useEffect(() => {
    const { start, destination } = match.params;

    if (start) {
      dispatch(getStationById(start, searchActions.setStart));
    }
    if (destination) {
      dispatch(getStationById(destination, searchActions.setDestination));
    }
    if (!routes.length && !dateTouched) {
      dispatch(searchActions.setDate(new Date(), false));
    }
  }, [dateTouched, dispatch, match.params, routes.length]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (start && destination) {
        dispatch(getRoutes(start.id, destination.id, date));
        history.push(`/routing/${start.id}/${destination.id}`);
      }
    },
    [date, destination, dispatch, history, start]
  );
  const goHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <>
      <StationSearch
        searchType={StationSearchType.DBNavgiator}
        value={start}
        onChange={s => dispatch(searchActions.setStart(s))}
        placeholder="Start"
      />
      <div className={classes.destination}>
        <StationSearch
          searchType={StationSearchType.DBNavgiator}
          value={destination}
          onChange={s => dispatch(searchActions.setDestination(s))}
          placeholder="Destination"
        />
        <IconButton
          style={{ padding: 0 }}
          onClick={(e: SyntheticEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(searchActions.setDestination(start));
            dispatch(searchActions.setStart(destination));
          }}
        >
          <SwapVertical fontSize="large" />
        </IconButton>
      </div>
      <DateTimePicker
        fullWidth
        openTo="hours"
        className={classes.datePicker}
        labelFunc={formatDate}
        ampm={false}
        showTodayButton
        value={date}
        onChange={date => dispatch(searchActions.setDate(date))}
        cancelLabel="Abbrechen"
        autoOk
        todayLabel="Jetzt"
        minutesStep={5}
      />
      <SettingsPanel />
      <div className={classes.buttons}>
        <Button fullWidth variant="contained" onClick={searchRoute}>
          Search
        </Button>
        <Button variant="contained" onClick={goHome}>
          Home
        </Button>
      </div>
    </>
  );
};
// }

export default Search;
