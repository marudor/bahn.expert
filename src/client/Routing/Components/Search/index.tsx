import {
  Button,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { css } from '@emotion/react';
import { Delete } from '@mui/icons-material';
import {
  FavoriteBorder,
  Search as SearchIcon,
  SwapVert,
  Today,
} from '@mui/icons-material';
import { getStopPlaceFromAPI } from 'client/Common/service/stopPlaceSearch';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { SettingsPanel } from './SettingsPanel';
import { StopPlaceSearch } from 'client/Common/Components/StopPlaceSearch';
import { useCallback, useEffect, useMemo } from 'react';
import { useFetchRouting } from 'client/Routing/provider/useFetchRouting';
import { useParams } from 'react-router';
import {
  useRoutingConfig,
  useRoutingConfigActions,
} from 'client/Routing/provider/RoutingConfigProvider';
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
  align-items: center;
  & input {
    cursor: pointer;
  }
`;

const StyledRadioGroup = styled(RadioGroup)`
  flex-direction: row;
  flex: 1;
  flex-wrap: nowrap;
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

const ClearIcon = SwapOriginDest.withComponent(Delete);

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
  const {
    setStart,
    setDestination,
    updateVia,
    setDate,
    setVia,
    updateDepartureMode,
  } = useRoutingConfigActions();
  const { start, destination, date, via, departureMode, formattedDate } =
    useRoutingConfig();
  const { clearRoutes, fetchRoutesAndNavigate } = useFetchRouting();

  const params = useParams<'start' | 'destination' | 'date' | 'via'>();

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
  }, [params.via, setVia]);

  const swapOriginDest = useCallback(() => {
    setDestination(start);
    setStart(destination);
  }, [start, destination, setStart, setDestination]);

  const searchRoute = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      void fetchRoutesAndNavigate(start, destination, via);
    },
    [destination, start, via, fetchRoutesAndNavigate],
  );

  const mappedViaList = useMemo(
    () =>
      via.map((v, index) => (
        <FlexContainer key={index}>
          <StopPlaceSearch
            id={`via${index}`}
            onChange={(s) => updateVia(index, s)}
            value={v}
          />
          <ClearIcon
            data-testid={`clearVia${index}`}
            onClick={() => updateVia(index)}
          />
        </FlexContainer>
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
        <StyledRadioGroup value={departureMode} onChange={updateDepartureMode}>
          <FormControlLabel
            value="ab"
            control={<Radio size="small" />}
            label="Ab"
          />
          <FormControlLabel
            value="an"
            control={<Radio size="small" />}
            label="An"
          />
        </StyledRadioGroup>
        <MobileDateTimePicker
          openTo="hours"
          componentsProps={{
            actionBar: {
              actions: ['clear', 'cancel', 'accept'],
            },
          }}
          value={date}
          renderInput={(props) => (
            <DateTimePickerInput
              {...props}
              error={false}
              inputProps={{
                ...props.inputProps,
                'data-testid': 'routingDatePicker',
                value: formattedDate,
                required: false,
              }}
            />
          )}
          onChange={setDate}
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
