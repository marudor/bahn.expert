import { createStyles } from '@material-ui/styles';

export default createStyles(theme => ({
  main: {
    lineHeight: 1.2,
    flexShrink: 0,
    marginTop: '.3em',
    overflow: 'visible',
    paddingLeft: '.5em',
    paddingRight: '.5em',
    position: 'relative',
  },
  scrollMarker: {
    position: 'absolute',
    top: -64,
  },
  entry: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: '.6em',
    userSelect: 'none',
    '@media screen and (max-width: 1200px)': {
      fontSize: '.36em',
    },
  },
  entryMain: {
    display: 'flex',
  },
  wing: {
    position: 'absolute',
    borderLeft: `1px solid ${theme.palette.text.primary}`,
    content: '" "',
    left: '.3em',
    top: '-1em',
    bottom: 0,
  },
  wingStart: {
    top: 0,
    '&::before': {
      content: '""',
      borderLeft: `1em solid ${theme.palette.text.primary}`,
      position: 'absolute',
      height: 1,
    },
  },
  wingEnd: {
    bottom: '.3em',
    '&::after': {
      content: '""',
      borderLeft: `1em solid ${theme.palette.text.primary}`,
      position: 'absolute',
      height: 1,
      bottom: 0,
    },
  },
}));
