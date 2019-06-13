import { AbfahrtenState, CommonState, RoutingState } from 'AppState';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useCommonSelector: TypedUseSelectorHook<CommonState> = useSelector;
export const useAbfahrtenSelector: TypedUseSelectorHook<
  AbfahrtenState
> = useSelector;
export const useRoutingSelector: TypedUseSelectorHook<
  RoutingState
> = useSelector;
