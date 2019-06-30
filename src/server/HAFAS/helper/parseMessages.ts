import { MsgL, ParsedCommon } from 'types/HAFAS';
import { uniqBy } from 'lodash';

export default (msgL: undefined | MsgL[], common: ParsedCommon) => {
  if (!msgL) return undefined;
  const messages = uniqBy(
    msgL
      .map(msg => common.remL[msg.remX])
      .filter(msg => msg.txtN !== 'Gleiswechsel'),
    'txtN'
  );

  return messages;
};
