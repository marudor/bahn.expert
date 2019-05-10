import { AuslastungsValue } from 'types/routing';
import { makeStyles, MergedTheme } from '@material-ui/styles';
import { Props } from './AuslastungsDisplay';

function getBGColor(theme: MergedTheme, auslastung?: null | AuslastungsValue) {
  switch (auslastung) {
    case AuslastungsValue.Gering:
      return theme.colors.green;
    case AuslastungsValue.Hoch:
      return theme.colors.yellow;
    case AuslastungsValue.SehrHoch:
      return theme.colors.orange;
    case AuslastungsValue.Ausgebucht:
      return theme.colors.red;
    default:
      return theme.palette.common.black;
  }
}

const getColor = (theme: MergedTheme, auslastung?: null | AuslastungsValue) => {
  const backgroundColor = getBGColor(theme, auslastung);

  return {
    backgroundColor,
    color: theme.palette.getContrastText(backgroundColor),
  };
};

export default makeStyles<MergedTheme, Props>(theme => ({
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

  first: props => getColor(theme, props.auslastung && props.auslastung.first),

  second: props => getColor(theme, props.auslastung && props.auslastung.second),
}));
