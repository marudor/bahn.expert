import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  main: {
    display: 'grid',
    gridTemplateColumns: '4.8em 1fr max-content',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". t p c" ". t p c" ". t p c" "wr wr wr wr" "m m m m"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
    position: 'relative',
  },
  cancelled: {
    ...theme.mixins.cancelled,
    ...theme.mixins.changed,
  },
  additional: theme.mixins.additional,
  stationName: {
    color: 'inherit',
  },
  station: {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  checkIn: {
    gridArea: 'c',
  },
  platform: {
    gridArea: 'p',
  },
  wr: {
    fontSize: '0.5em',
    gridArea: 'wr',
    overflow: 'hidden',
  },
  scrollMarker: {
    position: 'absolute',
    top: -64,
  },
  messages: {
    gridArea: 'm',
    paddingLeft: '.75em',
  },
}));
