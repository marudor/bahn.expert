import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { getDetailForAbfahrt } from 'Abfahrten/selector/abfahrten';
import { setDetail } from 'Abfahrten/actions/abfahrten';
import cc from 'classnames';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React, { useCallback } from 'react';
import Reihung from 'Common/Components/Reihung';
import Start from './Start';
import useStyles from './BaseAbfahrt.style';

export type OwnProps = {
  abfahrt: Abfahrt;
  sameTrainWing: boolean;
  wing: boolean;
  wingEnd?: boolean;
  wingStart?: boolean;
};
type StateProps = {
  detail: boolean;
  lineAndNumber: boolean;
  useZoom: boolean;
  fahrzeugGruppe: boolean;
};
type DispatchProps = ResolveThunks<{
  setDetail: typeof setDetail;
}>;
export type ReduxProps = OwnProps & StateProps & DispatchProps;

export type Props = ReduxProps;

const BaseAbfahrt = ({
  abfahrt,
  detail,
  wing,
  wingEnd,
  wingStart,
  lineAndNumber,
  useZoom,
  fahrzeugGruppe,
  setDetail,
}: Props) => {
  const classes = useStyles();
  const handleClick = useCallback(() => {
    setDetail(abfahrt.id);
  }, [abfahrt.id, setDetail]);

  return (
    <Paper
      square
      id={abfahrt.id}
      onClick={handleClick}
      className={classes.main}
    >
      {wing && (
        <span
          className={cc(classes.wing, {
            [classes.wingStart]: wingStart,
            [classes.wingEnd]: wingEnd,
          })}
        />
      )}
      <div className={classes.entry}>
        <div className={classes.entryMain}>
          <Start
            abfahrt={abfahrt}
            detail={detail}
            lineAndNumber={lineAndNumber}
          />
          <Mid abfahrt={abfahrt} detail={detail} />
          <End abfahrt={abfahrt} detail={detail} />
        </div>
        {detail && abfahrt.reihung && abfahrt.departure && (
          <Reihung
            useZoom={useZoom}
            fahrzeugGruppe={fahrzeugGruppe}
            trainNumber={abfahrt.trainNumber}
            currentStation={abfahrt.currentStation.id}
            scheduledDeparture={abfahrt.departure.scheduledTime}
          />
        )}
        {detail && (
          <div id={`${abfahrt.id}Scroll`} className={classes.scrollMarker} />
        )}
      </div>
    </Paper>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    detail: getDetailForAbfahrt(state, props),
    lineAndNumber: state.abfahrtenConfig.config.lineAndNumber,
    useZoom: state.abfahrtenConfig.config.zoomReihung,
    fahrzeugGruppe: state.abfahrtenConfig.config.fahrzeugGruppe,
  }),
  {
    setDetail,
  }
)(BaseAbfahrt);
