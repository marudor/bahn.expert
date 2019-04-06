// @flow
import routeSearch from './DBNavigator';

export type Options = {
  start: string,
  destination: string,
  time: number,
  transferTime?: number,
  maxChanges?: number,
  searchForDeparture?: boolean,
};

export default (options: Options) => routeSearch(options);
