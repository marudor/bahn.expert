import { MsgL, ParsedCommon, RemL } from 'types/HAFAS';
import { uniqBy } from 'lodash';

export default (
  msgL: undefined | MsgL[],
  common: ParsedCommon
): undefined | RemL[] => {
  if (!msgL) return undefined;

  const messages = uniqBy(
    msgL
      .map(msg => {
        const rem = common.remL[msg.remX];

        return rem;
      })
      .filter(msg => msg.txtN !== 'Gleiswechsel'),
    'txtN'
  );

  return messages;
};
