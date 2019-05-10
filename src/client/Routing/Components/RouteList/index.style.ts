import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>({
  main: {
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '.5em',
    },
  },
});
