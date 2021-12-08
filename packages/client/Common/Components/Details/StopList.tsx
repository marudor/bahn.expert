import { DetailsContext } from './DetailsContext';
import { Error } from '@material-ui/icons';
import { Loading } from '../Loading';
import { makeStyles } from '@material-ui/core';
import { Stop } from 'client/Common/Components/Details/Stop';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import type { AxiosError } from 'axios';
import type { FC } from 'react';
import type { Route$Stop } from 'types/routing';

function getErrorText(error: AxiosError) {
  if (error.code === 'ECONNABORTED') return 'Timeout, bitte neuladen.';
  if (error.response) {
    if (error.response.status === 404) {
      return 'Unbekannter Zug';
    }
  }

  return 'Unbekannter Fehler';
}

const useStyles = makeStyles({
  error: {
    width: '80%',
    height: '80%',
    margin: '0 auto',
    textAlign: 'center',
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
  },
});

interface Props {
  initialDepartureDate?: Date;
}

export const StopList: FC<Props> = ({ initialDepartureDate }) => {
  const classes = useStyles();
  const { details, error } = useContext(DetailsContext);
  const hasOccupancy = details?.stops.some((s) => s.auslastung);
  const [currentSequenceStop, setCurrentSequenceStop] = useState(
    details?.currentStop?.station.id,
  );

  const onStopClick = useCallback((stop: Route$Stop) => {
    setCurrentSequenceStop(stop.station.id);
  }, []);

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
          hasOccupancy={hasOccupancy}
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
  }, [details, currentSequenceStop]);

  if (error) {
    return (
      <main className={clsx(classes.wrap, classes.error)}>
        <Error className={classes.error} data-testid="error" />{' '}
        {getErrorText(error)}
      </main>
    );
  }

  if (!details) {
    return <Loading />;
  }

  return (
    <main className={classes.wrap}>
      {/* <Messages messages={details.messages} /> */}
      {detailsStops}
    </main>
  );
};
