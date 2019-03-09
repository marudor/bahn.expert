// @flow
import { connect } from 'react-redux';
import Loading from './Loading';
import React from 'react';
import type { AppState } from 'AppState';

type StateProps = {|
  +open: boolean,
|};

type Props = {|
  ...StateProps,
|};

const SettingsModal = React.lazy(() => import('./SettingsModal'));
const LazySettingsModal = ({ open }: Props) =>
  open && (
    <React.Suspense fallback={<Loading />}>
      <SettingsModal />
    </React.Suspense>
  );

export default connect<Props, *, StateProps, _, AppState, _>(state => ({
  open: state.config.open,
}))(LazySettingsModal);
