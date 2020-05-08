import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  expanded: {
    margin: '0!important',
    boxShadow: 'none',
    '&:before': {
      backgroundColor: 'transparent',
    },
    '&:after': {
      backgroundColor: 'transparent',
    },
  },
  summary: {
    minHeight: '0!important',
  },
  summaryContent: {
    margin: '22px 0 !important',
    display: 'flex',
    justifyContent: 'space-around',
  },
  details: {
    flexDirection: 'column',
  },
  badge: {
    '& span': {
      fontSize: '0.95rem',
    },
  },
  chip: {
    '& span': {
      fontSize: '0.95rem',
    },
  },
  label: {
    marginLeft: 0,
    '& * + span': {
      flex: 1,
    },
  },
  input: {
    width: '3.2em',
  },
});
