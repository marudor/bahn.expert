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
import { AllowedHafasProfile } from 'types/HAFAS';
import { Button, Divider, makeStyles } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import {
  Delete,
  FavoriteBorder,
  Search as SearchIcon,
  SwapVert,
  Today,
} from '@material-ui/icons';
import { getHafasStationFromAPI } from 'client/Common/service/stationSearch';
import { getRouteLink } from 'client/Routing/util';
import { SettingsPanel } from './SettingsPanel';
import { StationSearch } from 'client/Common/Components/StationSearch';
import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { useFetchRouting } from 'client/Routing/provider/useFetchRouting';
import { useHistory, useRouteMatch } from 'react-router';
import {
  useRoutingConfig,
  useRoutingConfigActions,
  useRoutingSettings,
} from 'client/Routing/provider/RoutingConfigProvider';
import deLocale from 'date-fns/locale/de';
import type { RoutingFav } from 'client/Routing/provider/RoutingFavProvider';
import type { Station } from 'types/station';

const maxViaForProvider = (profile?: AllowedHafasProfile) => {
  if (profile === AllowedHafasProfile.SBB) return 99;

  return 2;
};

const setStationById = async (
  stationId: string,
  setAction: (station: Station) => void,
  hafasProfile: AllowedHafasProfile
) => {
  const stations = await getHafasStationFromAPI(hafasProfile, stationId);

  if (stations.length) {
    setAction(stations[0]);
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

export const Search = () => {
  const classes = useStyles();
  const {
    setStart,
    setDestination,
    swapStartDestination,
    updateVia,
    setDate,
  } = useRoutingConfigActions();
  const { start, destination, date, via } = useRoutingConfig();
  const settings = useRoutingSettings();
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

  // This is not a dependency for the initialStationSearch. We do not want to retrigger them when this changes! (Unless one of the other 3 also changed)
  const favProfile = useMemo(() => {
    return history.location.state?.fav?.profile;
  }, [history.location.state]);

  useEffect(() => {
    if (match.params.start) {
      setStationById(
        match.params.start,
        setStart,
        favProfile || settings.hafasProfile
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.start, setStart, settings.hafasProfile]);
  useEffect(() => {
    if (match.params.destination) {
      setStationById(
        match.params.destination,
        setDestination,
        favProfile || settings.hafasProfile
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.destination, setDestination, settings.hafasProfile]);
  useEffect(() => {
    if (match.params.date && match.params.date !== '0') {
      setDate(new Date(Number.parseInt(match.params.date, 10)));
    }
  }, [match.params.date, setDate]);
  useEffect(() => {
    if (match.params.via) {
      const viaStations = match.params.via.split('|').filter(Boolean);

      viaStations.forEach((viaId, index) => {
        setStationById(
          viaId,
          (station) => {
            updateVia(index, station);
          },
          settings.hafasProfile
        );
      });
    }
  }, [match.params.via, settings.hafasProfile, updateVia]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (start && destination && start.id !== destination.id) {
        fetchRoutes();
        history.push(getRouteLink(start, destination, via, date));
      }
    },
    [date, destination, fetchRoutes, history, start, via]
  );

  const mappedViaList = useMemo(
    () =>
      via.map((v, index) => (
        <StationSearch
          id={`via${index}`}
          onChange={(s) => updateVia(index, s)}
          value={v}
          key={index}
          additionalIcon={<Delete onClick={() => updateVia(index)} />}
          profile={settings.hafasProfile}
        />
      )),
    [settings.hafasProfile, updateVia, via]
  );

  return (
    <>
      <StationSearch
        id="routingStartSearch"
        value={start}
        onChange={setStart}
        placeholder="Start"
        profile={settings.hafasProfile}
      />
      <div>
        {mappedViaList}
        {mappedViaList.length < maxViaForProvider(settings.hafasProfile) && (
          <StationSearch
            placeholder="Via Station"
            id="addVia"
            onChange={(s) => updateVia(-1, s)}
            profile={settings.hafasProfile}
          />
        )}
      </div>
      <div className={classes.destination}>
        <StationSearch
          id="routingDestinationSearch"
          value={destination}
          onChange={setDestination}
          placeholder="Destination"
          profile={settings.hafasProfile}
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
