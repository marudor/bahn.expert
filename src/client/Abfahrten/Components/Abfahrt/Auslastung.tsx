import * as React from 'react';
import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { AuslastungsValue, Route$Auslastung } from 'types/routing';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { getAuslastung } from 'Abfahrten/actions/auslastung';
import Close from '@material-ui/icons/Close';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
import Loading from 'Common/Components/Loading';
import Tooltip from '@material-ui/core/Tooltip';
import Warning from '@material-ui/icons/Warning';

type StateProps = {
  auslastung?: null | Route$Auslastung;
};
type DispatchProps = ResolveThunks<{
  getAuslastung: typeof getAuslastung;
}>;
type OwnProps = {
  abfahrt: Abfahrt;
};
type ReduxProps = StateProps & DispatchProps & OwnProps;

type Props = ReduxProps & WithStyles<typeof styles>;

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

class Auslastung extends React.PureComponent<Props> {
  componentDidMount() {
    const { auslastung, getAuslastung, abfahrt } = this.props;

    if (!auslastung && abfahrt.scheduledDeparture) {
      getAuslastung(
        abfahrt.trainNumber,
        abfahrt.currentStationEva,
        abfahrt.destination,
        abfahrt.scheduledDeparture
      );
    }
  }

  preventDefault = (e: React.SyntheticEvent<Element>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { auslastung, classes } = this.props;

    if (auslastung === null) {
      return null;
    }

    if (auslastung === undefined) {
      return <Loading type={1} />;
    }

    return (
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
  }
}

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

export const styles = createStyles({
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
  first: (props: ReduxProps) =>
    getColor(props.auslastung && props.auslastung.first),
  second: (props: ReduxProps) =>
    getColor(props.auslastung && props.auslastung.second),
});

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    auslastung:
      state.auslastung.auslastung[
        `${props.abfahrt.currentStationEva}/${props.abfahrt.destination}/${
          props.abfahrt.trainNumber
        }`
      ],
  }),
  {
    getAuslastung,
  }
)(withStyles(styles)(Auslastung));
