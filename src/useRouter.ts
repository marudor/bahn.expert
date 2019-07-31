import * as H from 'history';
import { RouteComponentProps, StaticContext } from 'react-router';
import { __RouterContext as RouterContext } from 'react-router';
import { useContext } from 'react';

// FIXME:  use official API when https://github.com/ReactTraining/react-router/pull/6453 merged

export function useRouter<
  Params extends { [K in keyof Params]?: string } = {}
>() {
  return useContext(RouterContext) as RouteComponentProps<
    Params,
    StaticContext,
    H.LocationState
  >;
}
