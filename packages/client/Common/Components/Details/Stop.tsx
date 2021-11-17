import { DetailMessages } from '../Messages/Detail';
import { DetailsContext } from './DetailsContext';
import { makeStyles } from '@material-ui/core';
import { Messages } from './Messages';
import { Platform } from 'client/Common/Components/Platform';
import { Reihung } from '../Reihung';
import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
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
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas:
      '"ar o1 t p c" "dp o2 t p c" "wr wr wr wr wr" "m m m m m"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    position: 'relative',
    gridTemplateColumns: ({ hasOccupancy }: { hasOccupancy: boolean }) =>
      `4.8em ${hasOccupancy ? '1.7em' : '0'} 1fr max-content`,
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
  occupancy1: {
    gridArea: 'o1',
  },
  occupancy2: {
    gridArea: 'o2',
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
  hasOccupancy?: boolean;
}
export const Stop: FC<Props> = ({
  stop,
  showWR,
  train,
  isPast,
  hasOccupancy = false,
}) => {
  const classes = useStyles({ hasOccupancy });
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
      {stop.auslastung && (
        <>
          <span className={classes.occupancy1} data-testid="occupancy1">
            1
            <SingleAuslastungsDisplay auslastung={stop.auslastung.first} />
          </span>
          <span className={classes.occupancy2} data-testid="occupancy2">
            2
            <SingleAuslastungsDisplay auslastung={stop.auslastung.second} />
          </span>
        </>
      )}
      {train && (
        <TravelynxLink
          className={classes.checkIn}
          evaNumber={stop.station.id}
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
            currentEvaNumber={stop.station.id}
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
