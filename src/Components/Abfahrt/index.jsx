// @flow
import AbfahrtenService, { IAbfahrt } from 'Services/AbfahrtenService';
import End from './End';
import Mid from './Mid';
import Paper from 'material-ui/Paper';
import React from 'react';
import Start from './Start';

interface Props {
  abfahrt: IAbfahrt,
  detail: boolean,
}
const Abfahrt = ({ abfahrt, detail }: Props) => {
  function setDetail() {
    AbfahrtenService.setDetail(abfahrt);
  }
  return (
    <Paper onClick={setDetail} style={style.wrapper}>
      <div style={style.entry}>
        <Start train={abfahrt.train} cancelled={abfahrt.isCancelled} />
        <Mid abfahrt={abfahrt} detail={detail} />
        <End abfahrt={abfahrt} detail={detail} />
      </div>
    </Paper>
  );
};

export default Abfahrt;

const style = {
  entry: {
    '@media screen and (max-width: 1200px)': { fontSize: '0.3em' },
    display: 'flex',
    flexShrink: 0,
    fontSize: '0.6em',
    lineHeight: 1,
    paddingTop: 5,
    userSelect: 'none',
  },
  wrapper: {
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
    cursor: 'pointer',
    flexShrink: 0,
    marginBottom: 5,
    overflow: 'hidden',
    paddingLeft: 15,
    paddingRight: 15,
  },
};
