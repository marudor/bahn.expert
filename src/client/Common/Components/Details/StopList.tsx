import DetailsContext from './DetailsContext';
import Loading from '../Loading';
// import Messages from './Messages';
import React, { useContext } from 'react';
import Stop from 'Common/Components/Details/Stop';
import useStyles from './StopList.style';

const StopList = () => {
  const details = useContext(DetailsContext);
  const classes = useStyles();

  // useEffect(() => {
  //   if (details && details.currentStop) {
  //     const scrollDom = document.getElementById(details.currentStop.station.id);

  //     if (scrollDom) {
  //       scrollDom.scrollIntoView();
  //     }
  //   }
  // }, [details]);

  if (!details) {
    return <Loading />;
  }

  return (
    <div className={classes.wrap}>
      {/* <Messages messages={details.messages} /> */}
      {details.stops.map(s => (
        <Stop
          stop={s}
          key={s.station.id}
          // showWR={
          //   details.currentStop &&
          //   s.station.id === details.currentStop.station.id
          //     ? details.train
          //     : undefined
          // }
        />
      ))}
    </div>
  );
};

export default StopList;
