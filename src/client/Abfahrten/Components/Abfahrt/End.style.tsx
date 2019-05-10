import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>({
  main: {
    fontSize: '2.5em',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '1em',
  },
});
