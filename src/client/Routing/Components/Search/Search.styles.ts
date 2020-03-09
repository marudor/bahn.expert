import { makeStyles } from '@material-ui/styles';
export default makeStyles(theme => ({
  datePicker: {
    '& input': {
      paddingLeft: 10,
      paddingRight: 10,
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
      fontSize: '1.2rem',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 20px',
      color: theme.palette.text.primary,
      border: `2px solid ${theme.palette.text.primary}`,
      borderRadius: '5px',
      backgroundColor: 'transparent',
    },
  },
  destination: {
    display: 'flex',
  },
}));
