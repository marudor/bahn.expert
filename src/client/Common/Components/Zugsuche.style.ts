import { makeStyles } from '@material-ui/styles';

export default makeStyles({
  main: {
    minWidth: '40%',
  },
  searchButton: {
    height: '45px',
    margin: '10px',
    width: '95%',
  },
  header: {
    textAlign: 'center',
    padding: '16px 24px 0px 24px',
  },
  searchInput: {
    margin: '20px',
  },
  dateInputWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
  },
  zugInputWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputIcon: {
    position: 'absolute',
    right: '20px',
    top: '30px',
  },
});
