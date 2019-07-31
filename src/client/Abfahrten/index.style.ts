import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme, { noHeader: boolean }>(theme => ({
  main: ({ noHeader }) => ({
    marginTop: noHeader ? -theme.shape.headerSpacing : undefined,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  }),
}));
