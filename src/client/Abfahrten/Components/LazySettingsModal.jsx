// @flow
import { connect } from 'react-redux';
import Loading from './Loading';
import React from 'react';
import type { AbfahrtenState } from 'AppState';

type StateProps = {|
  +open: boolean,
|};

type OwnProps = {||};
type DispatchProps = {|
  dispatch: Dispatch<*>,
|};
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

const SettingsModal = React.lazy(() => import('./SettingsModal'));
const LazySettingsModal = ({ open }: Props) =>
  open && (
    <React.Suspense fallback={<Loading />}>
      <SettingsModal />
    </React.Suspense>
  );

export default connect<Props, OwnProps, StateProps, DispatchProps, AbfahrtenState, _>(state => ({
  open: state.config.open,
}))(LazySettingsModal);
