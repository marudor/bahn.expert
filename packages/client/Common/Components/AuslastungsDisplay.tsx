import { makeStyles } from '@material-ui/core';
import { SingleAuslastungsDisplay } from 'client/Common/Components/SingleAuslastungsDisplay';
import type { FC } from 'react';
import type { Route$Auslastung } from 'types/routing';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    marginBottom: '.3em',
  },
  entry: {
    display: 'flex',
    marginRight: '.5em',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

export interface Props {
  auslastung: Route$Auslastung;
}

export const AuslastungsDisplay: FC<Props> = ({ auslastung }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrap} data-testid="auslastungDisplay">
      <div className={classes.entry} data-testid="first">
        <span>1</span>
        <SingleAuslastungsDisplay auslastung={auslastung.first} />
      </div>
      <div className={classes.entry} data-testid="second">
        <span>2</span>
        <SingleAuslastungsDisplay auslastung={auslastung.second} />
      </div>
    </div>
  );
};
