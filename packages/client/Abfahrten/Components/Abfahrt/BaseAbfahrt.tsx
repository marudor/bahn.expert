import { useCallback, useMemo } from 'react';
import AbfahrtenConfigContainer from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import End from './End';
import loadable from '@loadable/component';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import SelectedDetailContainer from 'client/Abfahrten/container/SelectedDetailContainer';
import Start from './Start';
import styled, { css } from 'styled-components/macro';
import type { Abfahrt } from 'types/iris';

const LazyReihung = loadable(() => import('client/Common/Components/Reihung'));

const Wings = styled.span<{ wingStart?: boolean; wingEnd?: boolean }>`
  position: absolute;
  border-left: 1px solid ${({ theme }) => theme.palette.text.primary};
  content: ' ';
  left: 0.3em;
  top: -1em;
  bottom: 0;
  ${({ wingStart, wingEnd, theme }) => [
    wingStart &&
      css`
        top: 0;
        ::before {
          content: ' ';
          border-left: 1em solid ${theme.palette.text.primary};
          position: absolute;
          height: 1px;
        }
      `,
    wingEnd &&
      css`
        bottom: 0.3em;
        ::after {
          content: ' ';
          border-left: 1em solid ${theme.palette.text.primary};
          position: absolute;
          height: 1px;
          bottom: 0;
        }
      `,
  ]}
`;
const PaperWrap = styled(Paper)`
  line-height: 1.2;
  flex-shrink: 0;
  margin-top: 0.3em;
  overflow: visible;
  padding: 0 0.5em;
  position: relative;
`;

const Entry = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  font-size: 0.6em;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('md')} {
    font-size: 0.36em;
  }
`;

const MainWrap = styled.div`
  display: flex;
`;

const ScrollMarker = styled.div`
  position: absolute;
  top: -64px;
`;

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
      <PaperWrap square id={abfahrt.id} onClick={handleClick}>
        {wingNumbers && <Wings wingStart={wingStart} wingEnd={wingEnd} />}
        <Entry
          data-testid={`abfahrt${abfahrt.train.type}${abfahrt.train.number}`}
        >
          <MainWrap>
            <Start
              abfahrt={abfahrt}
              detail={detail}
              lineAndNumber={lineAndNumber}
            />
            <Mid abfahrt={abfahrt} detail={detail} />
            <End abfahrt={abfahrt} detail={detail} />
          </MainWrap>
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
            <ScrollMarker
              data-testid="scrollMarker"
              id={`${abfahrt.id}Scroll`}
            />
          )}
        </Entry>
      </PaperWrap>
    ),
    [
      abfahrt,
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
