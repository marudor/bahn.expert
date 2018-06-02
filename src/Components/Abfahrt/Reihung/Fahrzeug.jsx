// @flow
import './Fahrzeug.scss';
import ActionAccessible from 'material-ui/svg-icons/action/accessible';
import React from 'react';
import type { Fahrzeug } from 'types/reihung';

type Props = {
  fahrzeug: Fahrzeug,
  destination: ?string,
};

type State = {
  info: AdditionalFahrzeugInfos,
};

// Klasse: 0 = unknown
// Klasse: 1 = Nur erste
// Klasse: 2 = Nur zweite
// Klasse: 3 = 1 & 2
// klasse: 4 = Nicht für Passagiere. z.B. Triebkopf
type AdditionalFahrzeugInfos = {
  klasse: 0 | 1 | 2 | 3 | 4,
  speise: boolean,
  rollstuhl: boolean,
  comfort: boolean,
};

const firstClassComfort = ['11', '26', '36', '28', '38'];
const secondClassComfort = ['7', '23', '33', '27', '37'];

function comfortLogic(fahrzeug: Fahrzeug, klasse: number) {
  if (fahrzeug.wagenordnungsnummer === '12' && fahrzeug.fahrzeugtyp === 'Avmz') {
    return true;
  } else if (
    fahrzeug.wagenordnungsnummer === '10' &&
    (fahrzeug.fahrzeugtyp === 'Bvmsz' || fahrzeug.fahrzeugtyp === 'Bimz')
  ) {
    return true;
  }
  if (klasse === 1) {
    return firstClassComfort.includes(fahrzeug.wagenordnungsnummer);
  } else if (klasse === 2) {
    return secondClassComfort.includes(fahrzeug.wagenordnungsnummer);
  }

  return false;
}

function getFahrzeugInfo(fahrzeug: Fahrzeug): AdditionalFahrzeugInfos {
  const data: AdditionalFahrzeugInfos = {
    klasse: 0,
    speise: false,
    rollstuhl: Boolean(fahrzeug.allFahrzeugausstattung.find(a => a.ausstattungsart === 'PLAETZEROLLSTUHL')),
    comfort: false,
  };

  switch (fahrzeug.kategorie) {
    case 'REISEZUGWAGENZWEITEKLASSE':
    case 'STEUERWAGENZWEITEKLASSE':
      data.klasse = 2;
      break;
    case 'HALBSPEISEWAGENZWEITEKLASSE':
    case 'SPEISEWAGEN':
      data.klasse = 2;
      data.speise = true;
      break;
    default:
      break;
    case 'REISEZUGWAGENERSTEZWEITEKLASSE':
      data.klasse = 3;
      break;
    case 'REISEZUGWAGENERSTEKLASSE':
    case 'STEUERWAGENERSTEKLASSE':
      data.klasse = 1;
      break;
    case 'TRIEBKOPF':
    case 'LOK':
      data.klasse = 4;
  }

  data.comfort = comfortLogic(fahrzeug, data.klasse);

  return data;
}

export default class FahrzeugComp extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    return {
      info: getFahrzeugInfo(props.fahrzeug),
    };
  }
  render() {
    const { fahrzeug /* , destination*/ } = this.props;
    const { info } = this.state;

    const { startprozent, endeprozent } = fahrzeug.positionamhalt;

    const start = Number.parseInt(startprozent, 10);
    const end = Number.parseInt(endeprozent, 10);

    const pos = {
      left: `${startprozent}%`,
      width: `${end - start}%`,
    };

    return (
      <div style={pos} className="Fahrzeug">
        <span className={`Fahrzeug__klasse Fahrzeug__klasse--${info.klasse}`} />
        <span className="Fahrzeug__nummer">{fahrzeug.wagenordnungsnummer}</span>
        {info.rollstuhl && <ActionAccessible className="Fahrzeug--rollstuhl" />}
        {info.comfort && <span className="Fahrzeug--comfort" />}
        <span className="Fahrzeug--type">{fahrzeug.fahrzeugtyp}</span>
        {/* {destination && <span className="Fahrzeug--destination">{destination}</span>} */}
      </div>
    );
  }
}
