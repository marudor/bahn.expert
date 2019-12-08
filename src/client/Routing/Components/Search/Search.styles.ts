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
  },
  destination: {
    display: 'flex',
  },
});
