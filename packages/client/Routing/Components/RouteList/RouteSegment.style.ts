import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  main: {
    backgroundColor: theme.colors.shadedBackground,
    padding: '0.4em',
    display: 'grid',
    gridTemplateColumns: '2fr 7fr 1fr',
    gridTemplateRows: '1fr auto 1fr',
    gridTemplateAreas:
      '"departureTime departureName departurePlatform" "train train train" "arrivalTime arrivalName arrivalPlatform"',
    marginTop: '1em',
    marginBottom: '1em',
  },
  arrivalTime: {
    gridArea: 'arrivalTime',
  },
  arrivalName: {
    gridArea: 'arrivalName',
  },
  arrivalPlatform: {
    gridArea: 'arrivalPlatform',
  },
  departureTime: {
    gridArea: 'departureTime',
  },
  departureName: {
    gridArea: 'departureName',
  },
  departurePlatform: {
    gridArea: 'departurePlatform',
  },
  train: {
    marginTop: '.5em',
    marginBottom: '.5em',
    gridArea: 'train',
    alignSelf: 'center',
    paddingLeft: '.3em',
    overflow: 'hidden',
  },
  platform: {
    textAlign: 'end',
  },
}));
