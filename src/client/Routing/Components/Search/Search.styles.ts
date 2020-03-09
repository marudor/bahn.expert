import { makeStyles } from '@material-ui/styles';
export default makeStyles(theme => ({
  datePicker: {
    '& input': {
      paddingRight: 10,
    },
    '& > div': {
      minHeight: '50px',
    },
  },
  buttons: {
    display: 'flex',
    marginBottom: '1em',
    marginTop: '15px',
    '& > button:nth-child(1)': {
      flex: 2,
    },
    '& > button:nth-child(2)': {
      flex: 1,
    },
    '& > button': {
      margin: '0 10px',
      height: '50px',
      fontSize: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 20px',
      color: theme.palette.text.primary,
    },
  },
  destination: {
    display: 'flex',
  },
  dateWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '10px',
    '& input': {
      fontSize: '1.4rem',
    },
  },
  todayIcon: {
    top: '50%',
    right: '0px',
    margin: '0 10px',
    position: 'absolute',
    transform: 'translateY(-50%)',
  },
}));
