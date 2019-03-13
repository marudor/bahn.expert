// @flow
import type { OwnProps } from './Fahrzeug';
export default {
  main: {
    position: 'absolute',
    height: '2em',
    border: 'black 1px solid',
    boxSizing: 'border-box',
  },
  closed: {
    background: 'repeating-linear-gradient(135deg, #999, #999, 5px, transparent 5px, transparent 10px);',
  },
  position: ({ fahrzeug, scale, correctLeft }: OwnProps) => {
    const { startprozent, endeprozent } = fahrzeug.positionamhalt;
    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    return {
      left: `${(start - correctLeft) * scale}%`,
      width: `${(end - start) * scale}%`,
    };
  },
  wrongWing: {
    background: 'darkgrey',
    '&::after': {
      content: '" "',
      position: 'absolute',
      top: 0,
      left: -1,
      right: -1,
      bottom: '-3.4em',
      zIndex: 5,
      background: 'rgba(255, 255, 255, 0.65)',
    },
  },
  nummer: {
    position: 'absolute',
    zIndex: 1,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  klasse: {
    position: 'absolute',
  },
  klasse0: {
    '&::after': {
      content: '"?"',
    },
  },
  klasse1: {
    backgroundColor: 'yellow',
    '&::after': {
      content: '"1"',
    },
  },
  klasse2: {
    backgroundColor: 'red',
    '&::after': {
      content: '"2"',
    },
  },
  klasse3: {
    background: 'linear-gradient(to right, yellow, red)',
    '&::after': {
      content: '"1/2"',
    },
  },
  klasse4: {
    left: '50%',
    transform: 'translateX(-50%)',
    '&::after': {
      content: '"LOK"',
    },
  },
  icons: {
    marginLeft: '.5em',
  },
  icon: {
    width: '0.5em !important',
    height: '0.5em !important',
    '@media screen and (max-width: 1200px)': {
      fontSize: '12px !important',
    },
  },
  type: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  comfort: {
    position: 'absolute',
    top: '.2em',
    right: '.3em',
    width: '.7em',
    height: '.7em',
    backgroundColor: 'red',
    borderRadius: '50%',
  },
};
