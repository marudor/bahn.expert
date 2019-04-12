// @flow
import routeSearch from './DBNavigator';

export type Options = {
  start: string,
  destination: string,
  time: number,
  transferTime?: number,
  maxChanges?: number,
  getPasslist?: boolean,
  searchForDeparture?: boolean,
  economic?: boolean,
  getTariff?: boolean,
};

export default (options: Options, parse?: Function) => routeSearch(options, parse);
