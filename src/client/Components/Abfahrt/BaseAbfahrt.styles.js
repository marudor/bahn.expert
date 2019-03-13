// @flow
export default {
  main: {
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24) !important',
    flexShrink: 0,
    marginBottom: '.3em',
    marginTop: '.2em',
    overflow: 'visible',
    paddingLeft: '.5em',
    paddingRight: '.5em',
    position: 'relative',
  },
  entry: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: '.6em',
    lineHeight: 1,
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
    borderLeft: '1px solid black',
    content: '" "',
    left: '.3em',
    top: '-1em',
    bottom: 0,
  },
  wingStart: {
    top: 0,
    '&::before': {
      content: '""',
      borderLeft: '1em solid black',
      position: 'absolute',
      height: 1,
    },
  },
  wingEnd: {
    bottom: '.3em',
    '&::after': {
      content: '""',
      borderLeft: '1em solid black',
      position: 'absolute',
      height: 1,
      bottom: 0,
    },
  },
};
