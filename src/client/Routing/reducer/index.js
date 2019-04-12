// @flow
import routing, { type State as RoutingState } from './routing';
import search, { type State as SearchState } from './search';

export type RoutingRootState = {|
  routing: RoutingState,
  search: SearchState,
|};

export default {
  routing,
  search,
};
