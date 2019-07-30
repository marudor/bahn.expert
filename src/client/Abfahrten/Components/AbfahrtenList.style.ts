import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.shape.headerSpacing,
  },

  lookaheadMarker: {
    height: 154,
    position: 'absolute',
    bottom: 0,
  },

  lookahead: {},

  lookbehind: {
    position: 'relative',
    paddingTop: 10,
    backgroundColor: theme.colors.shadedBackground,
  },
}));
