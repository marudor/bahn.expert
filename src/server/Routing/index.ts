import { SRoute$Result } from 'types/routing';
import routeSearch from './DBNavigator';

export type Options = {
  start: string;
  destination: string;
  time: number;
  transferTime?: number;
  maxChanges?: number;
  getPasslist?: boolean;
  searchForDeparture?: boolean;
  economic?: boolean;
  getTariff?: boolean;
};

export default (options: Options, parse?: (result: SRoute$Result) => any) =>
  routeSearch(options, parse);
