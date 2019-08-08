import { Common, Journey } from '.';

export interface JourneyMatchRequest {
  req: {
    jnyFltrL?: {
      value: string;
      type?: string;
      mode?: string;
    }[];
    date: string;
    input: string;
  };
  meth: 'JourneyMatch';
}

export interface JourneyMatchResponse {
  common: Common;
  jnyL: Journey[];
  fpB: string;
  fpE: string;
  planrtTS: string;
}
