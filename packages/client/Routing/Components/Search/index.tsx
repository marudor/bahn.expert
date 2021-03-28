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
import { Button, Divider, makeStyles } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import {
  Delete,
  FavoriteBorder,
  Search as SearchIcon,
  SwapVert,
  Today,
} from '@material-ui/icons';
import { getRouteLink } from 'client/Routing/util';
import { getStopPlaceFromAPI } from 'client/Common/service/stationSearch';
import { SettingsPanel } from './SettingsPanel';
import { StopPlaceSearch } from 'client/Common/Components/StopPlaceSearch';
import { useCallback, useEffect, useMemo } from 'react';
import { useFetchRouting } from 'client/Routing/provider/useFetchRouting';
import { useHistory, useRouteMatch } from 'react-router';
import {
  useRoutingConfig,
  useRoutingConfigActions,
} from 'client/Routing/provider/RoutingConfigProvider';
import deLocale from 'date-fns/locale/de';
import type { FC, SyntheticEvent } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';

const setStopPlaceById = async (
  evaNumber: string,
  setAction: (station: MinimalStopPlace) => void,
) => {
  const stopPlace = await getStopPlaceFromAPI(evaNumber);
  if (stopPlace) {
    setAction(stopPlace);
  }
};

const useStyles = makeStyles((theme) => ({
  destination: {
    display: 'flex',
  },
  datePickerWrap: {
    position: 'relative',
  },
  dateTimePicker: {
    '& input': {
      paddingRight: 10,
    },
  },
  buttons: {
    display: 'flex',
    margin: '15px 0 1em',
    '& > button:nth-child(1)': {
      flex: 2,
    },
    '& > button:nth-child(2)': {
      flex: 1,
    },
    '& > button': {
      margin: '0 10px',
      height: 50,
      fontSize: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 20px',
      color: theme.palette.text.primary,
    },
  },
  todayIcon: {
    top: '50%',
    right: 0,
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
}));

export const Search: FC = () => {
  const classes = useStyles();
  const {
    setStart,
    setDestination,
    swapStartDestination,
    updateVia,
    setDate,
  } = useRoutingConfigActions();
  const { start, destination, date, via } = useRoutingConfig();
  const { fetchRoutes, clearRoutes } = useFetchRouting();

  const match = useRouteMatch<{
    start?: string;
    destination?: string;
    date?: string;
    via?: string;
  }>();

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
      relativeDayString += `, ${deLocale.localize?.day(date.getDay(), {
        width: 'short',
      })}`;
    } else {
      relativeDayString = deLocale.localize?.day(date.getDay());
    }
    relativeDayString += ` ${lightFormat(date, 'dd.MM.')}`;
    if (!isSameYear(date, today)) {
      relativeDayString += lightFormat(date, 'yyyy');
    }
    relativeDayString += ` ${lightFormat(date, 'HH:mm')}`;

    return relativeDayString;
  }, []);

  const history = useHistory<
    | undefined
    | {
        fav: RoutingFav;
      }
  >();

  useEffect(() => {
    if (match.params.start) {
      void setStopPlaceById(match.params.start, setStart);
    }
  }, [match.params.start, setStart]);
  useEffect(() => {
    if (match.params.destination) {
      void setStopPlaceById(match.params.destination, setDestination);
    }
  }, [match.params.destination, setDestination]);
  useEffect(() => {
    if (match.params.date && match.params.date !== '0') {
      const dateNumber = +match.params.date;
      setDate(
        new Date(Number.isNaN(dateNumber) ? match.params.date : dateNumber),
      );
    }
  }, [match.params.date, setDate]);
  useEffect(() => {
    if (match.params.via) {
      const viaStations = match.params.via.split('|').filter(Boolean);

      viaStations.forEach((viaId, index) => {
        void setStopPlaceById(viaId, (stopPlace) => {
          updateVia(index, stopPlace);
        });
      });
    }
  }, [match.params.via, updateVia]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (start && destination && start.evaNumber !== destination.evaNumber) {
        void fetchRoutes();
        history.push(getRouteLink(start, destination, via, date));
      }
    },
    [date, destination, fetchRoutes, history, start, via],
  );

  const mappedViaList = useMemo(
    () =>
      via.map((v, index) => (
        <StopPlaceSearch
          id={`via${index}`}
          onChange={(s) => updateVia(index, s)}
          value={v}
          key={index}
          filterForIris={false}
          additionalIcon={<Delete onClick={() => updateVia(index)} />}
        />
      )),
    [updateVia, via],
  );

  return (
    <>
      <StopPlaceSearch
        id="routingStartSearch"
        value={start}
        onChange={setStart}
        placeholder="Start"
        filterForIris={false}
      />
      <div>
        {mappedViaList}
        {mappedViaList.length < 2 && (
          <StopPlaceSearch
            placeholder="Via Station"
            id="addVia"
            onChange={(s) => updateVia(-1, s)}
            filterForIris={false}
          />
        )}
      </div>
      <div className={classes.destination}>
        <StopPlaceSearch
          id="routingDestinationSearch"
          value={destination}
          onChange={setDestination}
          placeholder="Destination"
          filterForIris={false}
          additionalIcon={
            <SwapVert
              data-testid="swapStations"
              onClick={swapStartDestination}
              fontSize="large"
            />
          }
        />
      </div>
      <div className={classes.datePickerWrap}>
        <DateTimePicker
          className={classes.dateTimePicker}
          fullWidth
          openTo="hours"
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
        <Today className={classes.todayIcon} />
      </div>
      <SettingsPanel />
      <div className={classes.buttons}>
        <Button
          data-testid="search"
          fullWidth
          variant="contained"
          onClick={searchRoute}
          color="primary"
        >
          Search
          <SearchIcon />
        </Button>
        <Button
          color="secondary"
          variant="contained"
          data-testid="toFav"
          onClick={clearRoutes}
        >
          Favs
          <FavoriteBorder />
        </Button>
      </div>
      <Divider variant="middle" />
    </>
  );
};
