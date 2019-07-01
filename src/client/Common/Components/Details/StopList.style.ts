import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  wrap: {
    marginTop: theme.shape.headerSpacing,
    display: 'flex',
    flexDirection: 'column',
  },
  error: {
    width: '80%',
    height: '80%',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
}));
