import { BaseHeader } from '../BaseHeader';
import { DetailsContext } from './DetailsContext';
import { format } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useContext } from 'react';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Operator = styled.span(({ theme }) => theme.mixins.singleLineText, {
  gridArea: 'o',
});

const Destination = styled.span`
  grid-area: g;
`;

const TrainText = styled.span(({ theme }) => theme.mixins.singleLineText);

const Container = styled.div`
  font-size: 90%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: 'p a g' 'd a g' 'o o o';
  align-items: center;
  justify-items: center;
`;

const DateDisplay = styled.span(({ theme }) => theme.mixins.singleLineText, {
  gridArea: 'd',
});

const Arrow = styled.span`
  grid-area: a;
  min-width: 1.5em;
`;

interface Props {
  train: string;
}
export const Header: FC<Props> = ({ train }) => {
  const { details, refresh } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;
  const showLine =
    details &&
    details.train.number &&
    details.train.name.endsWith(details.train.number);
  const tooltipText =
    details &&
    (showLine
      ? `Linie ${details.train.line}`
      : `Nummer ${details.train.number}`);

  return (
    <BaseHeader>
      <Container data-testid="detailsHeader">
        <TrainText>
          <Tooltip title={tooltipText ?? trainText}>
            <span>{trainText}</span>
          </Tooltip>
        </TrainText>
        {details && (
          <>
            {details.train.operator && (
              <Tooltip title={details.train.operator.name}>
                <Operator>{details.train.operator.name}</Operator>
              </Tooltip>
            )}
            <DateDisplay>
              {format(details.departure.time, 'dd.MM.yyyy')}
            </DateDisplay>
            <Arrow> -&gt; </Arrow>
            <Destination>{details.segmentDestination.title}</Destination>
          </>
        )}
      </Container>
      <IconButton onClick={refresh} aria-label="refresh" color="inherit">
        <Refresh />
      </IconButton>
    </BaseHeader>
  );
};
