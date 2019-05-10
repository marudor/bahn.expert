import { makeStyles, MergedTheme } from '@material-ui/styles';

export default makeStyles<MergedTheme>(theme => ({
  '@keyframes cube': {
    '0%,70%,100%': {
      transform: 'scale3D(1, 1, 1)',
    },
    '35%': {
      transform: 'scale3D(0, 0, 1)',
    },
  },

  cube: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '35vmin',
    height: '35vmin',
    margin: 'auto',
    '& > div': {
      width: '33%',
      height: '33%',
      backgroundColor: theme.palette.text.primary,
      float: 'left',
      animation: '$cube 1.3s infinite ease-in-out',
    },
    '& > div:nth-child(1)': { animationDelay: '0.2s' },
    '& > div:nth-child(2)': { animationDelay: '0.3s' },
    '& > div:nth-child(3)': { animationDelay: '0.4s' },
    '& > div:nth-child(4)': { animationDelay: '0.1s' },
    '& > div:nth-child(5)': { animationDelay: '0.2s' },
    '& > div:nth-child(6)': { animationDelay: '0.3s' },
    '& > div:nth-child(7)': { animationDelay: '0s' },
    '& > div:nth-child(8)': { animationDelay: '0.1s' },
    '& > div:nth-child(9)': { animationDelay: '0.2s' },
  },

  '@keyframes dots': {
    '0%': {
      top: 6,
      height: 51,
    },
    '50%,100%': {
      top: 19,
      height: 26,
    },
  },

  dots: {
    display: 'inline-block',
    position: 'relative',
    width: 64,
    height: 64,
    '& > div': {
      display: 'inline-block',
      position: 'absolute',
      left: 6,
      width: 13,
      background: theme.palette.text.primary,
      animation: '$dots 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite',
    },
    '& > div:nth-child(1)': {
      left: 6,
      animationDelay: '-0.24s',
    },
    '& > div:nth-child(2)': {
      left: 26,
      animationDelay: '-0.12s',
    },
    '& > div:nth-child(3)': {
      left: 45,
      animationDelay: '0',
    },
  },
}));
