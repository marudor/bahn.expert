import { makeStyles } from '@material-ui/styles';

export default makeStyles(theme => ({
  main: {
    display: 'grid',
    gridTemplateColumns: '4.8em 1fr min-content',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". t p" ". t p" ". t p"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
  },

  station: {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  platform: {
    gridArea: 'p',
  },
}));
