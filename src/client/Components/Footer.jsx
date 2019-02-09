// @flow
import './Footer.scss';
import { connect } from 'react-redux';
import cc from 'classnames';
import React from 'react';
import type { AppState } from 'AppState';

type StateProps = {|
  online: boolean,
|};
type Props = {| ...StateProps |};

const Footer = ({ online }: Props) => (
  <div
    className={cc('Footer', {
      Footer__offline: !online,
    })}
  >
    Offline - momentan keine Aktualisierung möglich
  </div>
);

export default connect<AppState, Function, {||}, StateProps>(state => ({
  online: state.config.online,
}))(Footer);
