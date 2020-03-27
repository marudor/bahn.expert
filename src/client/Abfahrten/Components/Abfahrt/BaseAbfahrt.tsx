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
  wingNumbers?: string[];
  wingEnd?: boolean;
  wingStart?: boolean;
}

const BaseAbfahrt = ({ abfahrt, wingNumbers, wingEnd, wingStart }: Props) => {
  const wingNumbersWithoutSelf = wingNumbers?.filter(
    (wn) => wn !== abfahrt.train.number
  );
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
    config: { lineAndNumber },
  } = AbfahrtenConfigContainer.useContainer();

  return useMemo(
    () => (
      <Paper
        square
        id={abfahrt.id}
        onClick={handleClick}
        className={classes.main}
      >
        {wingNumbers && (
          <span
            className={cc(classes.wing, {
              [classes.wingStart]: wingStart,
              [classes.wingEnd]: wingEnd,
            })}
          />
        )}
        <div
          data-testid={`abfahrt${abfahrt.train.type}${abfahrt.train.number}`}
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
                trainNumber={abfahrt.train.number}
                currentStation={abfahrt.currentStation.id}
                scheduledDeparture={abfahrt.departure.scheduledTime}
                fallbackTrainNumbers={wingNumbersWithoutSelf}
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
      classes.entry,
      classes.entryMain,
      classes.main,
      classes.scrollMarker,
      classes.wing,
      classes.wingEnd,
      classes.wingStart,
      detail,
      handleClick,
      lineAndNumber,
      wingEnd,
      wingNumbers,
      wingNumbersWithoutSelf,
      wingStart,
    ]
  );
};

export default BaseAbfahrt;
