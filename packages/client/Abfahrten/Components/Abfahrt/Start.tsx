import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { makeStyles } from '@material-ui/core';
import { Substitute } from './Substitute';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import type { Abfahrt } from 'types/iris';

const useStyles = makeStyles((theme) => ({
  wrap: {
    flex: 1,
    fontSize: '3em',
    maxWidth: '5em',
    display: 'flex',
    flexDirection: 'column',
  },
  links: {
    fontSize: '.6em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cancelled: {
    ...theme.mixins.cancelled,
    ...theme.mixins.changed,
  },
}));

interface Props {
  abfahrt: Abfahrt;
  detail: boolean;
  lineAndNumber: boolean;
}

export const Start = ({ abfahrt, detail, lineAndNumber }: Props) => {
  const classes = useStyles();
  const urlPrefix = AbfahrtenConfigContainer.useContainer().urlPrefix;

  return (
    <div className={classes.wrap} data-testid="abfahrtStart">
      <span>{abfahrt.train.name}</span>
      {lineAndNumber && abfahrt.train.line && (
        <span>
          {abfahrt.train.type} {abfahrt.train.number}
        </span>
      )}
      {detail && (
        <div className={classes.links}>
          <TravelynxLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            station={abfahrt.currentStation}
          />
          <DetailsLink
            urlPrefix={urlPrefix}
            train={abfahrt.train}
            stationId={abfahrt.currentStation.id}
            initialDeparture={abfahrt.initialDeparture}
          />
        </div>
      )}
      {abfahrt.cancelled && (
        <span className={classes.cancelled}>Zugausfall</span>
      )}
      {abfahrt.substitute && abfahrt.ref && (
        <Substitute substitute={abfahrt.ref} />
      )}
      {detail && abfahrt.auslastung && <Auslastung abfahrt={abfahrt} />}
    </div>
  );
};
