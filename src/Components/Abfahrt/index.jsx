// @flow
import { type Abfahrt as AbfahrtType } from 'types/abfahrten';
import { connect } from 'react-redux';
import { setDetail } from 'actions/abfahrten';
import End from './End';
import Mid from './Mid';
import Paper from 'material-ui/Paper';
import React from 'react';
import Start from './Start';
import styles from './index.scss';

type Props = {
  abfahrt: AbfahrtType,
  detail: boolean,
  setDetail: typeof setDetail,
};
const Abfahrt = ({ abfahrt, detail, setDetail }: Props) => (
  <Paper onClick={() => setDetail(abfahrt.id)} className={styles.wrapper}>
    <div className={styles.entry}>
      <Start train={abfahrt.train} cancelled={abfahrt.isCancelled} />
      <Mid abfahrt={abfahrt} detail={detail} />
      <End abfahrt={abfahrt} detail={detail} />
    </div>
  </Paper>
);

export default connect(null, {
  setDetail,
})(Abfahrt);
