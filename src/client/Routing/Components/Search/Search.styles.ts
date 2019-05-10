import { makeStyles, MergedTheme } from '@material-ui/styles';
export default makeStyles<MergedTheme>({
  datePicker: {
    '& input': {
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  buttons: {
    display: 'flex',
  },
  destination: {
    display: 'flex',
  },
});
