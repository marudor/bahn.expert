import { createStyles } from '@material-ui/styles';

export default createStyles(theme => ({
  main: {
    position: 'absolute',
    height: '2em',
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
      bottom: '-3.4em',
      zIndex: 5,
      background: theme.colors.transparentBackground,
    },
  },

  nummer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    transform: 'translateX(-50%)',
  },

  klasse: {
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
    background: `linear-gradient(to right, ${theme.colors.yellow}, ${
      theme.colors.red
    })`,
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

  icons: {
    marginLeft: '.5em',
  },

  icon: {
    width: '0.5em !important',
    height: '0.5em !important',
    '@media screen and (max-width: 1200px)': {
      fontSize: '12px !important',
    },
  },

  type: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
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
