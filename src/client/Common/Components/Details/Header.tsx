import {
  ArrowBackIos,
  ArrowForwardIos,
  Map,
  Refresh,
} from '@mui/icons-material';
import { BaseHeader } from '../BaseHeader';
import { format } from 'date-fns';
import { IconButton } from '@mui/material';
import { StopPlaceNameWithRl100 } from '@/client/Common/Components/StopPlaceNameWithRl100';
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
  display: flex;
  align-items: center;
  grid-area: d;
`;

const Arrow = styled.span`
  grid-area: a;
  margin-right: 0.2em;
`;

const ArrowBack = styled(ArrowBackIos)`
  height: 0.5em;
  width: 0.5em;
  cursor: pointer;
`;

const ArrowForward = styled(ArrowBack.withComponent(ArrowForwardIos))`
  margin-left: 0.1em;
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
    initialDepartureDate,
    sameTrainDaysInFuture,
  } = useDetails();
  const refresh = useCallback(() => refreshDetails(), [refreshDetails]);
  const dateForward = useCallback(() => {
    sameTrainDaysInFuture(1);
  }, [sameTrainDaysInFuture]);

  const dateBack = useCallback(() => {
    sameTrainDaysInFuture(-1);
  }, [sameTrainDaysInFuture]);

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
        <>
          {operatorName && <Operator>{operatorName}</Operator>}
          <DateDisplay>
            <ArrowBack data-testid="previous" onClick={dateBack} />
            {format(
              details?.departure.time || initialDepartureDate,
              'dd.MM.yyyy',
            )}
            <ArrowForward data-testid="next" onClick={dateForward} />
          </DateDisplay>
          {/** Displayed as longer arrow, thanks safari that I need a single utf8 */}
          <Arrow> → </Arrow>
          {details && (
            <Destination>
              <StopPlaceNameWithRl100 stopPlace={details.segmentDestination} />
            </Destination>
          )}
        </>
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
