import { makeStyles } from '@material-ui/styles';
export default makeStyles({
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
    '& > button': {
      margin: '0 10px',
      height: '50px',
      fontSize: '1.2rem',
      minWidth: '150px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 20px',
      border: '2px solid #585858',
      borderRadius: '5px',
      backgroundColor: 'transparent',
    },
  },
  destination: {
    display: 'flex',
  },
});
