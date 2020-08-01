import { DetailsContext } from './DetailsContext';
import { Error } from '@material-ui/icons';
import { Loading } from '../Loading';
import { Stop } from 'client/Common/Components/Details/Stop';
import { useContext, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import type { ResponseError } from 'umi-request';

function getErrorText(error: ResponseError) {
  if (error.type === 'Timeout') return 'Timeout, bitte neuladen.';
  if (error.response) {
    if (error.response.status === 404) {
      return 'Unbekannter Zug';
    }
  }

  return 'Unbekannter Fehler';
}

const ErrorCss = css`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  text-align: center;
`;
const StyledError = styled(Error)`
  ${ErrorCss}
`;
const Wrap = styled.main<{ $error?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $error }) => $error && ErrorCss}
`;

export const StopList = () => {
  const { details, error } = useContext(DetailsContext);

  useEffect(() => {
    if (details && details.currentStop) {
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
          isPast={!hadCurrent}
          train={details.train}
          stop={s}
          key={s.station.id}
          showWR={
            details.currentStop?.station.id === s.station.id
              ? details.train
              : undefined
          }
        />
      );
    });
  }, [details]);

  if (error) {
    return (
      <Wrap $error>
        <StyledError data-testid="error" /> {getErrorText(error)}
      </Wrap>
    );
  }

  if (!details) {
    return <Loading />;
  }

  return (
    <Wrap>
      {/* <Messages messages={details.messages} /> */}
      {detailsStops}
    </Wrap>
  );
};
