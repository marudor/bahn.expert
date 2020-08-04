import { createContext, memo, useCallback, useContext, useMemo } from 'react';
import { End } from './End';
import { makeStyles } from '@material-ui/core';
import { Mid } from './Mid';
import { SelectedDetailContainer } from 'client/Abfahrten/container/SelectedDetailContainer';
import { Start } from './Start';
import clsx from 'clsx';
import loadable from '@loadable/component';
import Paper from '@material-ui/core/Paper';
import type { Abfahrt } from 'types/iris';

const LazyReihung = loadable(() => import('client/Common/Components/Reihung'));

// @ts-expect-error
export const AbfahrtContext = createContext<{
  abfahrt: Abfahrt;
  detail: boolean;
}>();
export const useAbfahrt = () => useContext(AbfahrtContext);

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
  detail: boolean;
  sameTrainWing: boolean;
  wingNumbers?: string[];
  wingEnd?: boolean;
  wingStart?: boolean;
}

export const BaseAbfahrt = memo(function BaseAbfahrt({
  abfahrt,
  wingNumbers,
  wingEnd,
  wingStart,
  detail,
}: Props) {
  const classes = useStyles();
  const wingNumbersWithoutSelf = wingNumbers?.filter(
    (wn) => wn !== abfahrt.train.number
  );
  const { setSelectedDetail } = SelectedDetailContainer.useContainer();
  const handleClick = useCallback(() => {
    setSelectedDetail(abfahrt.id);
  }, [abfahrt.id, setSelectedDetail]);
  const contextValue = useMemo(
    () => ({
      detail,
      abfahrt,
    }),
    [detail, abfahrt]
  );

  return (
    <AbfahrtContext.Provider value={contextValue}>
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
            <Start />
            <Mid />
            <End />
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
    </AbfahrtContext.Provider>
  );
});
