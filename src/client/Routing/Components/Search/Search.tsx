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
import { getStationsFromAPI } from 'Common/service/stationSearch';
import { Station } from 'types/api/station';
import { StationSearchType } from 'Common/config';
import { useHistory, useRouteMatch } from 'react-router';
import Button from '@material-ui/core/Button';
import deLocale from 'date-fns/locale/de';
import IconButton from '@material-ui/core/IconButton';
import React, { SyntheticEvent, useCallback, useEffect } from 'react';
import RoutingConfigContainer from 'Routing/container/RoutingConfigContainer';
import SettingsPanel from './SettingsPanel';
import StationSearch from 'Common/Components/StationSearch';
import SwapVertical from '@material-ui/icons/SwapVert';
import useFetchRouting from 'Routing/container/RoutingContainer/useFetchRouting';
import useStyles from './Search.styles';

const setStationById = async (
  stationId: string,
  setAction: (station: Station) => void
) => {
  const stations = await getStationsFromAPI(
    stationId,
    StationSearchType.DBNavgiator
  );

  if (stations.length) {
    setAction(stations[0]);
  }
};

const Search = () => {
  const classes = useStyles();
  const {
    start,
    setStart,
    destination,
    setDestination,
    date,
    setDate,
  } = RoutingConfigContainer.useContainer();
  const { fetchRoutes } = useFetchRouting();

  const match = useRouteMatch<{
    start?: string;
    destination?: string;
  }>();
  const history = useHistory();

  const formatDate = useCallback((date: null | Date) => {
    if (!date) {
      return `Jetzt (Heute ${lightFormat(new Date(), 'HH:mm')})`;
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
    if (match) {
      const { start, destination } = match.params;

      if (start) {
        setStationById(start, setStart);
      }
      if (destination) {
        setStationById(destination, setDestination);
      }
    }
  }, [match, setDestination, setStart]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (start && destination && start.id !== destination.id) {
        fetchRoutes();
        history.push(`/routing/${start.id}/${destination.id}`);
      }
    },
    [destination, fetchRoutes, history, start]
  );
  const goHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <>
      <StationSearch
        id="routingStartSearch"
        searchType={StationSearchType.DBNavgiator}
        value={start}
        onChange={setStart}
        placeholder="Start"
      />
      <div className={classes.destination}>
        <StationSearch
          id="routingDestinationSearch"
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
        openTo="hours"
        className={classes.datePicker}
        labelFunc={formatDate}
        ampm={false}
        value={date}
        onChange={setDate}
        cancelLabel="Abbrechen"
        autoOk
        clearable
        clearLabel="Jetzt"
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

export default React.memo(Search);
