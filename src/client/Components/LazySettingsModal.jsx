// @flow
import { connect } from 'react-redux';
import Loading from './Loading';
import React from 'react';
import type { AppState } from 'AppState';

type StateProps = {|
  open: boolean,
|};

type Props = {|
  ...StateProps,
|};

// $FlowFixMe
const SettingsModal = React.lazy(() => import('./SettingsModal'));
const LazySettingsModal = ({ open }: Props) =>
  open && (
    // $FlowFixMe
    <React.Suspense fallback={<Loading />}>
      <SettingsModal />
    </React.Suspense>
  );

export default connect<AppState, Function, {||}, StateProps>(state => ({
  open: state.config.open,
}))(LazySettingsModal);
