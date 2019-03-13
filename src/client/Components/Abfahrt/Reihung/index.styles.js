// @flow
import { type ReduxProps } from '.';
export default {
  main: {
    lineHeight: 1.3,
    fontSize: '120%',
    marginBottom: '1em',
    marginRight: '.3em',
    position: 'relative',
  },
  mainD: ({ reihung, fahrzeugGruppe }: ReduxProps) => {
    let height = 5;

    if (fahrzeugGruppe) height += 1;
    if (reihung?.differentZugnummer) height += 1;

    return {
      height: `${height}em`,
    };
  },
  specificType: {
    position: 'absolute',
    bottom: '-0.5em',
    zIndex: 10,
  },
  sektoren: {
    position: 'relative',
  },
  reihung: {
    position: 'relative',
    marginTop: '1.3em',
    height: '100%',
  },
  richtungD: ({ reihung }: ReduxProps) => ({
    transform: reihung?.realFahrtrichtung ? 'translateX(-50%)' : 'rotate(180deg) translateX(50%)',
  }),
  richtung: {
    backgroundColor: 'black',
    width: '50%',
    height: 2,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 0,
    zIndex: 10,
    '&::after': {
      border: 'solid black',
      borderWidth: '0 2px 2px 0',
      display: 'inline-block',
      padding: 3,
      content: '""',
      transform: 'rotate(135deg)',
      position: 'absolute',
      top: -3,
    },
  },
};
