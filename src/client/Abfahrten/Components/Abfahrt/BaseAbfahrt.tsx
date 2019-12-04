import { Abfahrt } from 'types/iris';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import cc from 'clsx';
import End from './End';
import loadable from '@loadable/component';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React, { useCallback, useMemo } from 'react';
import SelectedDetailContainer from 'Abfahrten/container/SelectedDetailContainer';
import Start from './Start';
import useStyles from './BaseAbfahrt.style';

const LazyReihung = loadable(() => import('Common/Components/Reihung'));

export interface Props {
  abfahrt: Abfahrt;
  sameTrainWing: boolean;
  wing: boolean;
  wingEnd?: boolean;
  wingStart?: boolean;
}

const BaseAbfahrt = ({ abfahrt, wing, wingEnd, wingStart }: Props) => {
  const classes = useStyles();
  const {
    setSelectedDetail,
    selectedDetail,
  } = SelectedDetailContainer.useContainer();
  const handleClick = useCallback(() => {
    setSelectedDetail(abfahrt.id);
  }, [abfahrt.id, setSelectedDetail]);
  const detail = selectedDetail === abfahrt.id;
  const {
    config: { lineAndNumber, zoomReihung, fahrzeugGruppe, showUIC },
  } = AbfahrtenConfigContainer.useContainer();

  return useMemo(
    () => (
      <Paper
        square
        id={abfahrt.id}
        onClick={handleClick}
        className={classes.main}
      >
        {!global.PROD && abfahrt.rawId}

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
              <LazyReihung
                loadHidden={!abfahrt.reihung && abfahrt.hiddenReihung}
                useZoom={zoomReihung}
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
    ),
    [
      abfahrt,
      classes,
      detail,
      fahrzeugGruppe,
      handleClick,
      lineAndNumber,
      showUIC,
      wing,
      wingEnd,
      wingStart,
      zoomReihung,
    ]
  );
};

export default BaseAbfahrt;
