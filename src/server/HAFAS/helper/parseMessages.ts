import { MsgL, ParsedCommon } from 'types/HAFAS';

export default (msgL: MsgL[], common: ParsedCommon) => {
  const messages = msgL.map(msg => common.remL[msg.remX]);

  return messages;
};
