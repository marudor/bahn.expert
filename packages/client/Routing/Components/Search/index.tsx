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
import { Button, Divider, TextField } from '@mui/material';
import { css } from '@emotion/react';
import {
  FavoriteBorder,
  Search as SearchIcon,
  SwapVert,
  Today,
} from '@mui/icons-material';
import { getRouteLink } from 'client/Routing/util';
import { getStopPlaceFromAPI } from 'client/Common/service/stopPlaceSearch';
import { MobileDateTimePicker } from '@mui/lab';
import { SettingsPanel } from './SettingsPanel';
import { StopPlaceSearch } from 'client/Common/Components/StopPlaceSearch';
import { useCallback, useEffect, useMemo } from 'react';
import { useFetchRouting } from 'client/Routing/provider/useFetchRouting';
import { useNavigate, useParams } from 'react-router';
import {
  useRoutingConfig,
  useRoutingConfigActions,
} from 'client/Routing/provider/RoutingConfigProvider';
import deLocale from 'date-fns/locale/de';
import styled from '@emotion/styled';
import type { FC, SyntheticEvent } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';

const setStopPlaceById = async (
  evaNumber: string,
  setAction: (station: MinimalStopPlace) => void,
) => {
  const stopPlace = await getStopPlaceFromAPI(evaNumber);
  if (stopPlace) {
    setAction(stopPlace);
  }
};

const FlexContainer = styled.div`
  display: flex;
`;

const DateTimeContainer = styled(FlexContainer)`
  & input {
    cursor: pointer;
  }
`;

const iconCss = css`
  right: 0.4em;
  position: absolute;
  align-self: center;
  cursor: pointer;
`;

const TodayIcon = styled(Today)`
  pointer-events: none;
  ${iconCss}
`;

const SwapOriginDest = styled(SwapVert)`
  ${iconCss}
`;

const Buttons = styled.div(({ theme }) => ({
  display: 'flex',
  margin: '15px 0 1em',
  '& > button:nth-of-type(1)': {
    flex: 2,
  },
  '& > button:nth-of-type(2)': {
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
}));

const DateTimePickerInput = styled(TextField)`
  width: 100%;
`;

export const Search: FC = () => {
  const { setStart, setDestination, updateVia, setDate, setVia } =
    useRoutingConfigActions();
  const { start, destination, date, via, touchedDate } = useRoutingConfig();
  const { fetchRoutes, clearRoutes } = useFetchRouting();

  const params = useParams<'start' | 'destination' | 'date' | 'via'>();

  const formattedDate = useMemo(() => {
    if (!touchedDate) {
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
  }, [touchedDate, date]);

  const navigate = useNavigate();

  useEffect(() => {
    if (params.start) {
      void setStopPlaceById(params.start, setStart);
    }
  }, [params.start, setStart]);
  useEffect(() => {
    if (params.destination) {
      void setStopPlaceById(params.destination, setDestination);
    }
  }, [params.destination, setDestination]);
  useEffect(() => {
    if (params.date && params.date !== '0') {
      const dateNumber = +params.date;
      setDate(new Date(Number.isNaN(dateNumber) ? params.date : dateNumber));
    }
  }, [params.date, setDate]);
  useEffect(() => {
    if (params.via) {
      const viaStations = params.via.split('|').filter(Boolean);

      void Promise.all(viaStations.map(getStopPlaceFromAPI)).then(
        (resolvedVias) => {
          setVia(resolvedVias.filter(Boolean));
        },
      );
    }
  }, [params.via, updateVia]);

  const swapOriginDest = useCallback(() => {
    setDestination(start);
    setStart(destination);
  }, [start, destination]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (start && destination && start.evaNumber !== destination.evaNumber) {
        void fetchRoutes();
        navigate(
          getRouteLink(start, destination, via, touchedDate ? date : null),
        );
      }
    },
    [date, destination, fetchRoutes, navigate, start, via, touchedDate],
  );

  const mappedViaList = useMemo(
    () =>
      via.map((v, index) => (
        <StopPlaceSearch
          id={`via${index}`}
          onChange={(s) => updateVia(index, s)}
          value={v}
          key={index}
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
      />
      <div>
        {mappedViaList}
        {mappedViaList.length < 2 && (
          <StopPlaceSearch
            placeholder="Via Station"
            id="addVia"
            onChange={(s) => updateVia(-1, s)}
          />
        )}
      </div>
      <FlexContainer>
        <StopPlaceSearch
          id="routingDestinationSearch"
          value={destination}
          onChange={setDestination}
          placeholder="Destination"
        />
        <SwapOriginDest onClick={swapOriginDest} />
      </FlexContainer>
      <DateTimeContainer>
        <MobileDateTimePicker
          openTo="hours"
          clearText="Jetzt"
          cancelText="Abbrechen"
          value={date}
          renderInput={(props) => (
            <DateTimePickerInput
              {...props}
              inputProps={{
                ...props.inputProps,
                'data-testid': 'routingDatePicker',
                value: formattedDate,
              }}
            />
          )}
          onChange={setDate}
          clearable
          minutesStep={5}
          toolbarTitle=""
        />
        <TodayIcon />
      </DateTimeContainer>
      <SettingsPanel />
      <Buttons>
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
      </Buttons>
      <Divider variant="middle" />
    </>
  );
};
