import { makeStyles } from '@material-ui/styles';
import type { Props } from './StationSearch';

export default makeStyles((theme) => ({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  icons: {
    '& > svg': {
      fontSize: '1.3em',
      verticalAlign: 'middle',
    },
    position: 'absolute',
    right: 0,
    cursor: 'pointer',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  paper: {
    background: theme.palette.background.default,
    position: 'absolute',
    zIndex: 2,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  loading: ({ additionalIcon }: Pick<Props, 'additionalIcon'>) => ({
    position: 'absolute',
    top: '-1em',
    right: additionalIcon ? '1.7em' : '.5em',
    transform: 'scale(.5)',
  }),
}));
