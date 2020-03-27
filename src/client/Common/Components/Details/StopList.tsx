import { AxiosError } from 'axios';
import cc from 'clsx';
import DetailsContext from './DetailsContext';
import Error from '@material-ui/icons/Error';
import Loading from '../Loading';
import React, { useContext, useEffect } from 'react';
import Stop from 'Common/Components/Details/Stop';
import useStyles from './StopList.style';

function getErrorText(error: AxiosError) {
  if (error.code === 'ECONNABORTED') return 'Timeout, bitte neuladen.';
  if (error.response) {
    if (error.response.status === 404) {
      return 'Unbekannter Zug';
    }
  }

  return 'Unbekannter Fehler';
}

const StopList = () => {
  const { details, error } = useContext(DetailsContext);
  const classes = useStyles();

  useEffect(() => {
    if (details && details.currentStop) {
      const scrollDom = document.getElementById(details.currentStop.station.id);

      if (scrollDom) {
        scrollDom.scrollIntoView();
      }
    }
  }, [details]);

  if (error) {
    return (
      <main className={cc(classes.wrap, classes.error)}>
        <Error data-testid="error" className={classes.error} />{' '}
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
      {details.stops.map((s) => (
        <Stop
          train={details.train}
          stop={s}
          key={s.station.id}
          showWR={
            details.currentStop &&
            s.station.id === details.currentStop.station.id
              ? details.train
              : undefined
          }
        />
      ))}
    </main>
  );
};

export default StopList;
