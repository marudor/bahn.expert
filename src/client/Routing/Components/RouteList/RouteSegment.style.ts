import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>({
  reihung: {
    fontSize: '0.5em',
  },
  main: {
    paddingLeft: '0.3em',
    display: 'grid',
    gridTemplateColumns: '2fr 7fr 1fr',
    gridTemplateRows: '1fr auto 1fr',
    gridTemplateAreas: '". . ." "t t t" ". . ."',
    marginTop: '1em',
    marginBottom: '1em',
  },
  train: {
    marginTop: '.5em',
    marginBottom: '.5em',
    gridArea: 't',
    alignSelf: 'center',
    paddingLeft: '.3em',
  },
  trainInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  trainMargin: {
    marginRight: '.5em',
  },
  destination: {
    flex: 1,
    textAlign: 'center',
  },
  platform: {
    textAlign: 'end',
  },
});
