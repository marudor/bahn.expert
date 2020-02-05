import { DefaultTheme, makeStyles } from '@material-ui/styles';

export default makeStyles<DefaultTheme, { noHeader: boolean }>(theme => ({
  main: ({ noHeader }) => ({
    marginTop: noHeader ? -theme.shape.headerSpacing : undefined,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  }),
}));
