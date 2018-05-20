// @flow
import './Fahrzeug.scss';
import ActionAccessible from 'material-ui/svg-icons/action/accessible';
import React from 'react';
import type { Fahrzeug } from 'types/reihung';

type Props = {
  fahrzeug: Fahrzeug,
};

type State = {
  info: AdditionalFahrzeugInfos,
};

// Klasse: 0 = unknown
// Klasse: 1 = Nur erste
// Klasse: 2 = Nur zweite
// Klasse: 3 = 1 & 2
type AdditionalFahrzeugInfos = {
  klasse: 0 | 1 | 2 | 3,
  speise: boolean,
  rollstuhl: boolean,
};

function getFahrzeugInfo(fahrzeug: Fahrzeug): AdditionalFahrzeugInfos {
  const data: AdditionalFahrzeugInfos = {
    klasse: 0,
    speise: false,
    rollstuhl: Boolean(fahrzeug.allFahrzeugausstattung.find(a => a.ausstattungsart === 'PLAETZEROLLSTUHL')),
  };

  switch (fahrzeug.kategorie) {
    case 'REISEZUGWAGENZWEITEKLASSE':
    case 'STEUERWAGENZWEITEKLASSE':
      data.klasse = 2;
      break;
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
  }

  return data;
}

export default class FahrzeugComp extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    return {
      info: getFahrzeugInfo(props.fahrzeug),
    };
  }
  render() {
    const { fahrzeug } = this.props;
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
      </div>
    );
  }
}
