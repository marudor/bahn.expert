import { css, Paper, styled } from '@mui/material';
import { Fragment } from 'react';
import { partition } from '@/client/util';
import { TrainRun } from '@/client/TrainRuns/Components/TrainRun';
import type { FC } from 'react';
import type { TrainRunWithBR } from '@/types/trainRuns';

interface Props {
  trainRuns: TrainRunWithBR[];
  selectedDate: Date;
}

const BaseEntryCss = css`
  padding-left: 0.5em;
  padding-right: 0.5em;
  grid-template-columns: 80px 0.5fr 100px 80px 2fr 2fr 4em;
  grid-template-rows: 40px;
  display: grid;
  align-items: center;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const EntryContainer = styled(Paper, {
  shouldForwardProp: (p) => p !== 'alternate',
})<{ alternate?: boolean }>(
  BaseEntryCss,
  ({ alternate, theme }) =>
    alternate && {
      backgroundColor: theme.colors.shadedBackground,
    },
);

const Header: FC = () => (
  <EntryContainer>
    <span>Gattung</span>
    <span>Baureihe</span>
    <span>Zugnummer</span>
    <span>Linie</span>
    <span>Start</span>
    <span>Ziel</span>
    <span></span>
  </EntryContainer>
);

export const TrainRunList: FC<Props> = ({ trainRuns, selectedDate }) => {
  const partitionedRuns = partition(trainRuns, 11);
  return (
    <>
      {partitionedRuns.map((runs, i) => (
        <Fragment key={i}>
          <Header />
          {runs.map((r, i) => (
            <EntryContainer alternate={i % 2 === 0} key={i}>
              <TrainRun trainRun={r} selectedDate={selectedDate} />
            </EntryContainer>
          ))}
        </Fragment>
      ))}
    </>
  );
};
