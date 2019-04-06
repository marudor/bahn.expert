// @flow
import routing, { type State as RoutingState } from './routing';

export type RoutingRootState = {|
  routing: RoutingState,
|};

export default {
  routing,
};
