import { createContext, memo, useCallback, useContext, useMemo } from 'react';
import { css } from '@emotion/react';
import { End } from './End';
import { Mid } from './Mid';
import { Paper } from '@mui/material';
import { Start } from './Start';
import { useSetSelectedDetail } from 'client/Abfahrten/provider/SelectedDetailProvider';
import loadable from '@loadable/component';
import styled from '@emotion/styled';
import type { Abfahrt } from 'types/iris';

const LazyReihung = loadable(() => import('client/Common/Components/Reihung'));

interface AbfahrtContextValues {
  abfahrt: Abfahrt;
  detail: boolean;
}

// @ts-expect-error default context not needed
export const AbfahrtContext = createContext<AbfahrtContextValues>();
export const useAbfahrt = (): AbfahrtContextValues =>
  useContext(AbfahrtContext);

const wingStartEnd = (color: string) =>
  css({
    content: '" "',
    borderLeft: `1em solid ${color}`,
    position: 'absolute',
    height: '1px',
  });

const Container = styled(Paper)`
  line-height: 1.2;
  flex-shrink: 0;
  margin-top: 0.3em;
  overflow: visible;
  padding: 0 0.5em;
  position: relative;
`;

const WingIndicator = styled.span<{ wingEnd?: boolean; wingStart?: boolean }>(
  ({ wingEnd, wingStart, theme }) => ({
    position: 'absolute',
    borderLeft: `1px solid ${theme.palette.text.primary}`,
    content: '" "',
    left: '.3em',
    top: wingStart ? 0 : '-1em',
    bottom: wingEnd ? '.3em' : 0,
    '&::before': wingStart
      ? wingStartEnd(theme.palette.text.primary)
      : undefined,
    '&::after': wingEnd
      ? css`
          ${wingStartEnd(theme.palette.text.primary)};
          bottom: 0;
        `
      : undefined,
  }),
);

const Entry = styled.div(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  fontSize: '.6em',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    fontSize: '.36em',
  },
}));

const MainWrap = styled.div`
  display: flex;
`;

const ScrollMarker = styled.div`
  position: absolute;
  top: -64px;
`;

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
  const wingNumbersWithoutSelf = wingNumbers?.filter(
    (wn) => wn !== abfahrt.train.number,
  );
  const setSelectedDetail = useSetSelectedDetail();
  const handleClick = useCallback(() => {
    setSelectedDetail(abfahrt.train.number || abfahrt.id);
  }, [abfahrt, setSelectedDetail]);
  const contextValue = useMemo(
    () => ({
      detail,
      abfahrt,
    }),
    [detail, abfahrt],
  );

  return (
    <AbfahrtContext.Provider value={contextValue}>
      <Container square id={abfahrt.id} onClick={handleClick}>
        {wingNumbers && (
          <WingIndicator wingEnd={wingEnd} wingStart={wingStart} />
        )}
        <Entry
          data-testid={`abfahrt${abfahrt.train.type}${abfahrt.train.number}`}
        >
          <MainWrap>
            <Start />
            <Mid />
            <End />
          </MainWrap>
          {detail && abfahrt.departure && (
            <LazyReihung
              loadHidden={!abfahrt.reihung}
              trainNumber={abfahrt.train.number}
              currentEvaNumber={abfahrt.currentStopPlace.evaNumber}
              initialDeparture={abfahrt.initialDeparture}
              scheduledDeparture={abfahrt.departure.scheduledTime}
              fallbackTrainNumbers={wingNumbersWithoutSelf}
            />
          )}
          {detail && (
            <ScrollMarker
              data-testid="scrollMarker"
              id={`${abfahrt.train.number}Scroll`}
            />
          )}
        </Entry>
      </Container>
    </AbfahrtContext.Provider>
  );
});
