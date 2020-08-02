import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import { End } from './End';
import { makeStyles } from '@material-ui/core';
import { Mid } from './Mid';
import { SelectedDetailContainer } from 'client/Abfahrten/container/SelectedDetailContainer';
import { Start } from './Start';
import { useCallback } from 'react';
import clsx from 'clsx';
import loadable from '@loadable/component';
import Paper from '@material-ui/core/Paper';
import type { Abfahrt } from 'types/iris';

const LazyReihung = loadable(() => import('client/Common/Components/Reihung'));

const wingStartEnd = (color: String) => ({
  content: '""',
  borderLeft: `1em solid ${color}`,
  position: 'absolute',
  height: '1px',
});

const useStyles = makeStyles((theme) => ({
  wing: {
    position: 'absolute',
    borderLeft: `1px solid ${theme.palette.text.primary}`,
    content: ' ',
    left: '.3em',
    top: '-1em',
    bottom: 0,
  },
  wingStart: {
    top: 0,
    '&::before': wingStartEnd(theme.palette.text.primary),
  },
  wingEnd: {
    bottom: '.3em',
    '&::after': {
      ...wingStartEnd(theme.palette.text.primary),
      bottom: 0,
    },
  },
  wrap: {
    lineHeight: 1.2,
    flexShrink: 0,
    marginTop: '.3em',
    overflow: 'visible',
    padding: '0 .5em',
    position: 'relative',
  },
  entry: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: '.6em',
    userSelect: 'none',
    [theme.breakpoints.down('md')]: {
      fontSize: '.36em',
    },
  },
  mainWrap: {
    display: 'flex',
  },
  scrollMarker: {
    position: 'absolute',
    top: -64,
  },
}));

export interface Props {
  abfahrt: Abfahrt;
  sameTrainWing: boolean;
  wingNumbers?: string[];
  wingEnd?: boolean;
  wingStart?: boolean;
}

export const BaseAbfahrt = ({
  abfahrt,
  wingNumbers,
  wingEnd,
  wingStart,
}: Props) => {
  const classes = useStyles();
  const wingNumbersWithoutSelf = wingNumbers?.filter(
    (wn) => wn !== abfahrt.train.number
  );
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

  return (
    <Paper
      className={classes.wrap}
      square
      id={abfahrt.id}
      onClick={handleClick}
    >
      {wingNumbers && (
        <span
          className={clsx(classes.wing, {
            [classes.wingEnd]: wingEnd,
            [classes.wingStart]: wingStart,
          })}
        />
      )}
      <div
        className={classes.entry}
        data-testid={`abfahrt${abfahrt.train.type}${abfahrt.train.number}`}
      >
        <div className={classes.mainWrap}>
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
            className={classes.scrollMarker}
            data-testid="scrollMarker"
            id={`${abfahrt.id}Scroll`}
          />
        )}
      </div>
    </Paper>
  );
};
