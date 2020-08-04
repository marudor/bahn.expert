import { DetailsContext } from './DetailsContext';
import { Error } from '@material-ui/icons';
import { Loading } from '../Loading';
import { makeStyles } from '@material-ui/core';
import { Stop } from 'client/Common/Components/Details/Stop';
import { useContext, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import type { AxiosError } from 'axios';

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

export const StopList = () => {
  const classes = useStyles();
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
