import * as React from 'react';
import { AuslastungsValue, Route$Auslastung } from 'types/routing';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
import useStyles from './AuslastungsDisplay.style';
import Warning from '@material-ui/icons/Warning';

interface OwnProps {
  auslastung: Route$Auslastung;
}

export type Props = OwnProps;

function getIcon(auslastung?: AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return <Done fontSize="inherit" />;
    case AuslastungsValue.Hoch:
      return <Warning fontSize="inherit" />;
    case AuslastungsValue.SehrHoch:
      return <ErrorOutline fontSize="inherit" />;
    case AuslastungsValue.Ausgebucht:
      return <Close fontSize="inherit" />;
    default:
      return <Help fontSize="inherit" />;
  }
}

const AuslastungsDisplay = (props: Props) => {
  const classes = useStyles(props);
  const { auslastung } = props;

  return (
    <div className={classes.main}>
      <div data-testid="first" className={classes.entry}>
        <span>1</span>
        <span className={`${classes.icon} ${classes.first}`}>
          {getIcon(auslastung.first)}
        </span>
      </div>
      <div data-testid="second" className={classes.entry}>
        <span>2</span>
        <span className={`${classes.icon} ${classes.second}`}>
          {getIcon(auslastung.second)}
        </span>
      </div>
    </div>
  );
};

export default AuslastungsDisplay;
