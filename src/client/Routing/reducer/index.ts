import routing, { State as RoutingState } from './routing';
import search, { State as SearchState } from './search';

export type RoutingRootState = {
  routing: RoutingState;
  search: SearchState;
};

export default {
  routing,
  search,
};
