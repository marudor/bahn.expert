import { DetailMessages } from '../Messages/Detail';
import { DetailsContext } from './DetailsContext';
import { makeStyles } from '@material-ui/core';
import { Messages } from './Messages';
import { Platform } from 'client/Common/Components/Platform';
import { Reihung } from '../Reihung';
import { StationLink } from 'client/Common/Components/StationLink';
import { Time } from 'client/Common/Components/Time';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useContext } from 'react';
import clsx from 'clsx';
import type { FC } from 'react';
import type { ParsedProduct } from 'types/HAFAS';
import type { Route$Stop } from 'types/routing';

const useStyles = makeStyles((theme) => ({
  wrap: {
    padding: '0 .5em',
    display: 'grid',
    gridTemplateColumns: '4.8em 1fr max-content',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '"ar t p c" "dp t p c" "wr wr wr wr" "m m m m"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    position: 'relative',
  },
  past: {
    backgroundColor: theme.colors.shadedBackground,
  },
  scrollMarker: {
    position: 'absolute',
    top: -64,
  },
  arrival: {
    gridArea: 'ar',
  },
  station: {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  additional: theme.mixins.additional,
  cancelled: theme.mixins.cancelled,
  stationName: {
    color: 'inherit',
  },
  checkIn: {
    gridArea: 'c',
  },
  departure: {
    gridArea: 'dp',
  },
  platform: {
    gridArea: 'p',
  },
  reihungWrap: {
    fontSize: '.5em',
    gridArea: 'wr',
    overflow: 'hidden',
  },
  messageWrap: {
    gridArea: 'm',
    paddingLeft: '.75em',
  },
}));

interface Props {
  stop: Route$Stop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
  isPast?: boolean;
}
export const Stop: FC<Props> = ({ stop, showWR, train, isPast }) => {
  const classes = useStyles();
  const { urlPrefix } = useContext(DetailsContext);
  const depOrArrival = stop.departure || stop.arrival;
  const platforms = stop.departure
    ? {
        real: stop.departure.platform,
        scheduled: stop.departure.scheduledPlatform,
      }
    : stop.arrival
    ? {
        real: stop.arrival.platform,
        scheduled: stop.arrival.scheduledPlatform,
      }
    : {};

  return (
    <div
      className={clsx(classes.wrap, isPast && classes.past)}
      data-testid={stop.station.id}
    >
      <div className={classes.scrollMarker} id={stop.station.id} />
      {stop.arrival && (
        <Time
          className={classes.arrival}
          cancelled={stop.arrival.cancelled}
          oneLine
          real={stop.arrival.time}
          delay={stop.arrival.delay}
        />
      )}
      <span
        className={clsx(classes.station, {
          [classes.additional]: stop.additional,
          [classes.cancelled]: stop.cancelled,
        })}
      >
        <StationLink
          className={classes.stationName}
          stationName={stop.station.title}
          urlPrefix={urlPrefix}
        />
      </span>
      {train && (
        <TravelynxLink
          className={classes.checkIn}
          station={stop.station}
          train={train}
          departure={stop.departure}
          arrival={stop.arrival}
        />
      )}
      {stop.departure && (
        <Time
          className={classes.departure}
          cancelled={stop.departure.cancelled}
          oneLine
          real={stop.departure.time}
          delay={stop.departure.delay}
        />
      )}
      {/* {stop.messages && <div>{stop.messages.map(m => m.txtN)}</div>} */}
      <Platform className={classes.platform} {...platforms} />
      <div className={classes.reihungWrap}>
        {showWR?.number && depOrArrival && (
          <Reihung
            trainNumber={showWR.number}
            currentStation={stop.station.title}
            scheduledDeparture={depOrArrival.scheduledTime}
            loadHidden={!depOrArrival?.reihung}
          />
        )}
      </div>
      <div className={classes.messageWrap}>
        {stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
        <Messages messages={stop.messages} />
      </div>
    </div>
  );
};
