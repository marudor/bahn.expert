import { Abfahrt } from 'types/abfahrten';
import { SelectedDetailContext } from 'Abfahrten/hooks/useSelectedDetail';
import { shallowEqual } from 'react-redux';
import { useAbfahrtenSelector } from 'useSelector';
import cc from 'clsx';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React, { useCallback, useContext } from 'react';
import Reihung from 'Common/Components/Reihung';
import Start from './Start';
import useStyles from './BaseAbfahrt.style';

export interface Props {
  abfahrt: Abfahrt;
  sameTrainWing: boolean;
  wing: boolean;
  wingEnd?: boolean;
  wingStart?: boolean;
}

const BaseAbfahrt = ({ abfahrt, wing, wingEnd, wingStart }: Props) => {
  const classes = useStyles();
  const { setSelectedDetail, selectedDetail } = useContext(
    SelectedDetailContext
  );
  const handleClick = useCallback(() => {
    setSelectedDetail(abfahrt.id);
  }, [abfahrt.id, setSelectedDetail]);
  const detail = selectedDetail === abfahrt.id;
  const {
    lineAndNumber,
    useZoom,
    fahrzeugGruppe,
    showUIC,
  } = useAbfahrtenSelector(
    state => ({
      lineAndNumber: state.abfahrtenConfig.config.lineAndNumber,
      useZoom: state.abfahrtenConfig.config.zoomReihung,
      fahrzeugGruppe: state.abfahrtenConfig.config.fahrzeugGruppe,
      showUIC: state.abfahrtenConfig.config.showUIC,
    }),
    shallowEqual
  );

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
      <div
        data-testid={`abfahrt${abfahrt.train.trainCategory}${abfahrt.train.number}`}
        className={classes.entry}
      >
        <div className={classes.entryMain}>
          <Start
            abfahrt={abfahrt}
            detail={detail}
            lineAndNumber={lineAndNumber}
          />
          <Mid abfahrt={abfahrt} detail={detail} />
          <End abfahrt={abfahrt} detail={detail} />
        </div>
        {detail &&
          abfahrt.departure &&
          (abfahrt.reihung || abfahrt.hiddenReihung) && (
            <Reihung
              loadHidden={!abfahrt.reihung && abfahrt.hiddenReihung}
              useZoom={useZoom}
              showUIC={showUIC}
              fahrzeugGruppe={fahrzeugGruppe}
              trainNumber={abfahrt.train.number}
              currentStation={abfahrt.currentStation.id}
              scheduledDeparture={abfahrt.departure.scheduledTime}
            />
          )}
        {detail && (
          <div
            data-testid="scrollMarker"
            id={`${abfahrt.id}Scroll`}
            className={classes.scrollMarker}
          />
        )}
      </div>
    </Paper>
  );
};

export default BaseAbfahrt;
