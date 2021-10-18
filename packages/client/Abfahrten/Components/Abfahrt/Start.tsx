import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { makeStyles } from '@material-ui/core';
import { Name } from 'client/Abfahrten/Components/Abfahrt/Name';
import { Substitute } from './Substitute';
import { TravelynxLink } from 'client/Common/Components/CheckInLink/TravelynxLink';
import { useAbfahrt } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { useAbfahrtenUrlPrefix } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import type { FC } from 'react';

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

export const Start: FC = () => {
  const classes = useStyles();
  const urlPrefix = useAbfahrtenUrlPrefix();
  const { abfahrt, detail } = useAbfahrt();

  return (
    <div className={classes.wrap} data-testid="abfahrtStart">
      <Name />
      {detail && (
        <div className={classes.links}>
          <TravelynxLink
            arrival={abfahrt.arrival}
            departure={abfahrt.departure}
            train={abfahrt.train}
            evaNumber={abfahrt.currentStopPlace.evaNumber}
          />
          <DetailsLink
            urlPrefix={urlPrefix}
            train={abfahrt.train}
            evaNumber={abfahrt.currentStopPlace.evaNumber}
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
      {detail && <Auslastung />}
    </div>
  );
};
