import { AuslastungsValue } from 'types/routing';
import { makeStyles, Theme } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import clsx from 'clsx';
import Done from '@material-ui/icons/Done';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Help from '@material-ui/icons/Help';
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

const getColors = (backgroundColor: string, theme: Theme) => ({
  backgroundColor,
  color: theme.palette.getContrastText(backgroundColor),
});

const useStyles = makeStyles((theme) => ({
  [AuslastungsValue.Gering]: getColors(theme.colors.green, theme),
  [AuslastungsValue.Hoch]: getColors(theme.colors.yellow, theme),
  [AuslastungsValue.SehrHoch]: getColors(theme.colors.orange, theme),
  [AuslastungsValue.Ausgebucht]: getColors(theme.colors.red, theme),
  wrap: {
    fontSize: '.7em',
    display: 'inline-block',
    borderRadius: '50%',
    textAlign: 'center',
    padding: '.2em',
    lineHeight: 0,
  },
}));

export interface Props {
  auslastung?: AuslastungsValue;
}
export const SingleAuslastungsDisplay = ({ auslastung }: Props) => {
  const classes = useStyles();

  return (
    // @ts-expect-error
    <span className={clsx(classes[auslastung], classes.wrap)}>
      {getIcon(auslastung)}
    </span>
  );
};
