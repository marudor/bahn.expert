import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    maxWidth: '450px',
    margin: '0 auto',
  },
  autoUpdate: {
    width: '3em',
  },
  label: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    marginRight: '0',
    marginLeft: '0',
    marginBottom: '15px',
    width: '100%',
  },
  header: {
    textAlign: 'center',
    '& h2': {
      fontSize: '1.5rem',
      fontWeight: '600',
    },
  },
});
