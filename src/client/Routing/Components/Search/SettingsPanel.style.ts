import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  expanded: {
    margin: '0!important',
  },
  summary: {
    minHeight: '0!important',
  },
  summaryContent: {
    margin: '12px 0 !important',
  },
  details: {
    flexDirection: 'column',
  },
  label: {
    marginLeft: 0,
    '& span': {
      flex: 1,
    },
  },
  input: {
    width: '3em',
  },
});
