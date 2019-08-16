import { AbfahrtenState, RoutingState } from 'AppState';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useAbfahrtenSelector: TypedUseSelectorHook<
  AbfahrtenState
> = useSelector;
export const useRoutingSelector: TypedUseSelectorHook<
  RoutingState
> = useSelector;
