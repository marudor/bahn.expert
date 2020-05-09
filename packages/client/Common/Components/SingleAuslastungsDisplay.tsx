import { AuslastungsValue } from 'types/routing';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
import useStyles from './SingleAuslastungsDisplay.style';
import Warning from '@material-ui/icons/Warning';

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

export interface Props {
  auslastung?: AuslastungsValue;
}
const SingleAuslastungsDisplay = (props: Props) => {
  const classes = useStyles(props);

  return (
    <span className={`${classes.icon} ${classes.color}`}>
      {getIcon(props.auslastung)}
    </span>
  );
};

export default SingleAuslastungsDisplay;
