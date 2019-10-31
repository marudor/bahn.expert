import { ParsedJourneyDetails } from './JourneyDetails';

export interface TrainSearchResult {
  value: string;
  cycle: number;
  pool: number;
  id: number;
  dep: string;
  trainLink: string;
  journParam: string;
  pubTime: string;
  depDate: string;
  depTime: string;
  arr: string;
  arrTime: string;
  vt: string;
  jid: string;
  ctxRecon: string;
  jDetails: ParsedJourneyDetails;
}
