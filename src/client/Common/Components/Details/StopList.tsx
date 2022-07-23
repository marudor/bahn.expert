import { css } from '@emotion/react';
import { DetailsContext } from './DetailsContext';
import { Error } from '@mui/icons-material';
import { Loading } from '../Loading';
import { Stop } from 'client/Common/Components/Details/Stop';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import type { Route$Stop } from 'types/routing';

function getErrorText(error: AxiosError) {
  if (error.code === 'ECONNABORTED') return 'Timeout, bitte neuladen.';
  if (error.response?.status === 404) {
    return 'Unbekannter Zug';
  }

  return 'Unbekannter Fehler';
}

const Container = styled.main`
  display: flex;
  flex-direction: column;
`;

const ErrorStyle = css`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  text-align: center;
`;

const ErrorContainer = styled(Container)(ErrorStyle);
const ErrorIcon = styled(Error)(ErrorStyle);

interface Props {
  initialDepartureDate?: Date;
}

export const StopList: FC<Props> = ({ initialDepartureDate }) => {
  const { details, error } = useContext(DetailsContext);
  const [currentSequenceStop, setCurrentSequenceStop] = useState(
    details?.currentStop?.station.id,
  );

  const onStopClick = useCallback((stop: Route$Stop) => {
    setCurrentSequenceStop(stop.station.id);
  }, []);

  useEffect(() => {
    if (details && details.currentStop) {
      setCurrentSequenceStop(details.currentStop.station.id);
      const scrollDom = document.getElementById(details.currentStop.station.id);

      if (scrollDom) {
        scrollDom.scrollIntoView();
      }
    }
  }, [details]);

  const detailsStops = useMemo(() => {
    if (!details) return null;
    let hadCurrent = false;

    return details.stops.map((s) => {
      if (details.currentStop?.station.id === s.station.id) {
        hadCurrent = true;
      }

      return (
        <Stop
          onStopClick={onStopClick}
          isPast={!hadCurrent}
          train={details.train}
          stop={s}
          key={s.station.id}
          showWR={
            currentSequenceStop === s.station.id ? details.train : undefined
          }
          initialDepartureDate={initialDepartureDate}
        />
      );
    });
  }, [details, currentSequenceStop, onStopClick, initialDepartureDate]);

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon data-testid="error" /> {getErrorText(error)}
      </ErrorContainer>
    );
  }

  if (!details) {
    return <Loading />;
  }

  return (
    <Container>
      {/* <Messages messages={details.messages} /> */}
      {detailsStops}
    </Container>
  );
};
