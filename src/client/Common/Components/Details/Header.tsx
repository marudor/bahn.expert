import { BaseHeader } from '../BaseHeader';
import { format } from 'date-fns';
import { IconButton } from '@mui/material';
import { Map, Refresh } from '@mui/icons-material';
import { useCallback, useMemo } from 'react';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import styled from '@emotion/styled';
import type { CommonProductInfo } from '@/types/HAFAS';
import type { FC } from 'react';

const SingleLineSpan = styled.span(({ theme }) => theme.mixins.singleLineText);

const Operator = styled(SingleLineSpan)`
  grid-area: o;
`;

const Destination = styled.span`
  grid-area: g;
  max-height: 2rem;
  overflow: hidden;
  word-break: break-word;
`;

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

const DateDisplay = styled(SingleLineSpan)`
  grid-area: d;
`;

const Arrow = styled.span`
  grid-area: a;
  margin-right: 0.2em;
`;

interface FTNProps {
  train?: CommonProductInfo;
  fallback: string;
}

const FullTrainName: FC<FTNProps> = ({ train, fallback }) => {
  if (!train) {
    return <span>{fallback}</span>;
  }
  const usesNumberAsIdentification =
    train?.number && train.name.endsWith(train.number);
  return (
    <span data-testid="detailsTrainName">
      {train.name}
      {!usesNumberAsIdentification && ` (${train.number})`}
    </span>
  );
};

export const Header: FC = () => {
  const {
    details,
    additionalInformation,
    refreshDetails,
    trainName,
    polyline,
    toggleMapDisplay,
  } = useDetails();
  const refresh = useCallback(() => refreshDetails(), [refreshDetails]);

  const operatorName = useMemo(
    () => additionalInformation?.operatorName || details?.train.operator?.name,
    [additionalInformation, details],
  );

  return (
    <BaseHeader>
      <Container data-testid="detailsHeader">
        <SingleLineSpan>
          <FullTrainName train={details?.train} fallback={trainName} />
        </SingleLineSpan>
        {details && (
          <>
            {operatorName && <Operator>{operatorName}</Operator>}
            <DateDisplay>
              {format(details.departure.time, 'dd.MM.yyyy')}
            </DateDisplay>
            {/** Displayed as longer arrow, thanks safari that I need a single utf8 */}
            <Arrow> → </Arrow>
            <Destination>{details.segmentDestination.title}</Destination>
          </>
        )}
      </Container>
      {polyline && (
        <IconButton
          size="small"
          onClick={toggleMapDisplay}
          aria-label="map"
          color="inherit"
        >
          <Map />
        </IconButton>
      )}
      <IconButton
        size="small"
        onClick={refresh}
        aria-label="refresh"
        color="inherit"
      >
        <Refresh />
      </IconButton>
    </BaseHeader>
  );
};
