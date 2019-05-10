import { makeStyles, MergedTheme } from '@material-ui/styles';
import { Props } from '.';

export default makeStyles<MergedTheme, Props>(theme => ({
  main: ({ noHeader }) => ({
    marginTop: noHeader ? -theme.shape.headerSpacing : undefined,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, sans-serif',
  }),
}));
