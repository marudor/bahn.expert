import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { css } from '@emotion/react';
import { End } from './End';
import { journeyFind } from 'client/Common/service/details';
import { Mid } from './Mid';
import { Paper } from '@mui/material';
import { Start } from './Start';
import { useSetSelectedDetail } from 'client/Abfahrten/provider/SelectedDetailProvider';
import loadable from '@loadable/component';
import styled from '@emotion/styled';
import type { Abfahrt } from 'types/iris';
import type { FC } from 'react';

const LazyReihung = loadable(() => import('client/Common/Components/Reihung'));

interface AbfahrtContextValues {
  abfahrt: Abfahrt;
  detail: boolean;
  journeyId?: string;
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

export const BaseAbfahrt: FC<Props> = ({
  abfahrt,
  wingNumbers,
  wingEnd,
  wingStart,
  detail,
}) => {
  const wingNumbersWithoutSelf = wingNumbers?.filter(
    (wn) => wn !== abfahrt.train.number,
  );
  const setSelectedDetail = useSetSelectedDetail();
  const handleClick = useCallback(() => {
    setSelectedDetail(abfahrt.id);
  }, [abfahrt.id, setSelectedDetail]);
  const [journeyId, setJourneyId] = useState<string>();
  const contextValue = useMemo(
    () => ({
      detail,
      abfahrt,
      journeyId,
    }),
    [detail, abfahrt, journeyId],
  );

  useEffect(() => {
    async function getJourney() {
      if (!journeyId && detail) {
        try {
          const foundJourney = await journeyFind(
            abfahrt.train.number,
            abfahrt.initialDeparture,
            abfahrt.initialStopPlace,
            false,
            'detailsClick',
          );
          if (foundJourney.length === 1) {
            setJourneyId(foundJourney[0].jid);
          }
        } catch {
          // we just ignore errors
        }
      }
    }
    void getJourney();
  }, [detail, abfahrt, journeyId]);

  return (
    <AbfahrtContext.Provider value={contextValue}>
      <Container square id={`${abfahrt.id}container`} onClick={handleClick}>
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
              trainNumber={abfahrt.train.number}
              trainCategory={abfahrt.train.type}
              currentEvaNumber={abfahrt.currentStopPlace.evaNumber}
              initialDeparture={abfahrt.initialDeparture}
              scheduledDeparture={abfahrt.departure.scheduledTime}
              fallbackTrainNumbers={wingNumbersWithoutSelf}
            />
          )}
          {detail && (
            <ScrollMarker data-testid="scrollMarker" id={abfahrt.id} />
          )}
        </Entry>
      </Container>
    </AbfahrtContext.Provider>
  );
};
