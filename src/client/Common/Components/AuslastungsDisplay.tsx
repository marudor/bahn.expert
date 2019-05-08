import * as React from 'react';
import { AuslastungsValue, Route$Auslastung } from 'types/routing';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Warning from '@material-ui/icons/Warning';

interface OwnProps {
  auslastung: Route$Auslastung;
}

type Props = OwnProps & WithStyles<typeof styles>;

function getTooltipText(auslastung?: AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return 'Geringe Auslastung';
    case AuslastungsValue.Hoch:
      return 'Mittlere Auslastung';
    case AuslastungsValue.SehrHoch:
      return 'Hohe Auslastung';
    case AuslastungsValue.Ausgebucht:
      return 'Ausgebucht';
    default:
      return 'Unbekannt';
  }
}

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

const AuslastungsDisplay = ({ auslastung, classes }: Props) => (
  <div className={classes.main}>
    <div className={classes.entry}>
      <span>1</span>
      <Tooltip title={getTooltipText(auslastung.first)}>
        <span className={`${classes.icon} ${classes.first}`}>
          {getIcon(auslastung.first)}
        </span>
      </Tooltip>
    </div>
    <div className={classes.entry}>
      <span>2</span>
      <Tooltip title={getTooltipText(auslastung.second)}>
        <span className={`${classes.icon} ${classes.second}`}>
          {getIcon(auslastung.second)}
        </span>
      </Tooltip>
    </div>
  </div>
);

function getBGColor(auslastung?: null | AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return 'green';
    case AuslastungsValue.Hoch:
      return 'yellow';
    case AuslastungsValue.SehrHoch:
      return 'orange';
    case AuslastungsValue.Ausgebucht:
      return 'red';
    default:
      return 'black';
  }
}
const getColor = (auslastung?: null | AuslastungsValue) => ({
  backgroundColor: getBGColor(auslastung),
  color: auslastung === 2 || auslastung === 3 ? 'black' : 'white',
});

export const styles = createStyles(theme => ({
  main: {
    display: 'flex',
    marginBottom: '.3em',
  },

  entry: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '.5em',
    alignItems: 'center',
  },

  icon: {
    fontSize: '.7em',
    display: 'inline-block',
    borderRadius: '50%',
    textAlign: 'center',
    padding: '.2em',
    lineHeight: 0,
    color: 'white',
  },

  // @ts-ignore ???
  first: props => getColor(props.auslastung && props.auslastung.first),

  // @ts-ignore ???
  second: props => getColor(props.auslastung && props.auslastung.second)
}));

export default withStyles(styles)(AuslastungsDisplay);
