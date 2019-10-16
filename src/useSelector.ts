import { RoutingState } from 'AppState';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useRoutingSelector: TypedUseSelectorHook<
  RoutingState
> = useSelector;
