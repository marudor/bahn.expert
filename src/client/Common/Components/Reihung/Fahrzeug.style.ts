import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  main: {
    position: 'absolute',
    height: '2.5em',
    border: `${theme.palette.text.primary} 1px solid`,
    boxSizing: 'border-box',
  },

  closed: {
    background:
      'repeating-linear-gradient(135deg, #999, #999, 5px, transparent 5px, transparent 10px);',
  },

  wrongWing: {
    background: theme.colors.shadedBackground,
    '&::after': {
      content: '" "',
      position: 'absolute',
      top: -1,
      left: -1,
      right: -1,
      bottom: '-3.7em',
      pointerEvents: 'none',
      zIndex: 5,
      background: theme.colors.transparentBackground,
    },
  },

  extraInfo: {
    position: 'absolute',
    top: '150%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    textAlign: 'center',
  },

  auslastung: {
    display: 'flex',
    flexDirection: 'column',
  },

  nummer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 0,
  },

  klasse: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },

  klasse0: {
    '&::after': {
      content: '"?"',
    },
  },

  klasse1: {
    backgroundColor: theme.colors.yellow,
    color: theme.palette.getContrastText(theme.colors.yellow),
    '&::after': {
      content: '"1"',
    },
  },

  klasse2: {
    backgroundColor: theme.colors.red,
    color: theme.palette.getContrastText(theme.colors.red),
    '&::after': {
      content: '"2"',
    },
  },

  klasse3: {
    background: `linear-gradient(to right, ${theme.colors.yellow}, ${theme.colors.red})`,
    '&::after': {
      content: '"1/2"',
    },
  },

  klasse4: {
    left: '50%',
    transform: 'translateX(-50%)',
    '&::after': {
      content: '"LOK"',
    },
  },

  icons: {},

  icon: {
    width: '0.6em !important',
    height: '0.6em !important',
    [theme.breakpoints.down('md')]: {
      fontSize: '16px !important',
    },
  },
  comfort: {
    position: 'absolute',
    top: '.2em',
    right: '.3em',
    width: '.7em',
    height: '.7em',
    backgroundColor: theme.colors.red,
    borderRadius: '50%',
  },
}));
