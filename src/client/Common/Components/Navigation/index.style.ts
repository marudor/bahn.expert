import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  drawer: {
    width: '230px',
    '& a': {
      color: 'inherit',
    },
    '& .MuiListItem-button': {
      padding: '20px 20px',
    },
  },
  header: {
    textAlign: 'center',
  },
}));
