import { getBaureiheByUIC } from 'server/coachSequence/baureihe';
import type { BRInfo, Fahrzeug } from 'types/reihung';

export default (uic: string, fahrzeuge: Fahrzeug[]): undefined | BRInfo => {
  const br = getBaureiheByUIC(
    uic,
    fahrzeuge.map((f) => ({
      class: f.additionalInfo.klasse,
    })),
  );
  if (!br) return undefined;
  return {
    name: br.name,
    identifier: br.identifier,
    BR: br.baureihe,
  };
};
