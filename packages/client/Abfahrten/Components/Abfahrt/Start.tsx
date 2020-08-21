import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { makeStyles } from '@material-ui/core';
import { Substitute } from './Substitute';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import {
  useAbfahrtenConfig,
  useAbfahrtenUrlPrefix,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';

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
  cancelled: theme.mixins.changed,
}));

export const Start = () => {
  const classes = useStyles();
  const { lineAndNumber } = useAbfahrtenConfig();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { abfahrt, detail } = useAbfahrt();

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
        <span data-testid="zugausfall" className={classes.cancelled}>
          Zugausfall
        </span>
      )}
      {abfahrt.substitute && abfahrt.ref && (
        <Substitute substitute={abfahrt.ref} />
      )}
      {detail && abfahrt.auslastung && <Auslastung />}
    </div>
  );
};
