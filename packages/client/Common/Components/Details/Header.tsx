import { BaseHeader } from '../BaseHeader';
import { DetailsContext } from './DetailsContext';
import { format } from 'date-fns';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { singleLineText } from 'client/util/cssUtils';
import { Tooltip } from '@material-ui/core';
import { useContext } from 'react';
import styled from 'styled-components';

const HeaderWrap = styled.div`
  font-size: 90%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: 'p a g' 'o a g' 'd a g';
  align-items: center;
  justify-items: center;
`;

const BaseGrid = styled.span`
  ${singleLineText}
`;
const Product = styled(BaseGrid)`
  ${singleLineText}
`;

const Operator = styled(BaseGrid)`
  grid-area: o;
`;
const Date = styled(BaseGrid)`
  grid-area: d;
`;
const Arrow = styled.span`
  grid-area: a;
  min-width: 1.5em;
`;
const Destination = styled.span`
  grid-area: g;
`;

interface Props {
  train: string;
}
export const Header = ({ train }: Props) => {
  const { details } = useContext(DetailsContext);

  const trainText = details ? details.train.name : train;

  return (
    <BaseHeader>
      <HeaderWrap data-testid="detailsHeader">
        <Product>
          {trainText}
          {details?.plannedSequence && (
            <PlannedType plannedSequence={details.plannedSequence} />
          )}
        </Product>
        {details && (
          <>
            {details.train.operator && (
              <Tooltip title={details.train.operator.name}>
                <Operator>{details.train.operator.name}</Operator>
              </Tooltip>
            )}
            <Date>{format(details.departure.time, 'dd.MM.yyyy')}</Date>
            <Arrow> -&gt; </Arrow>
            <Destination>{details.segmentDestination.title}</Destination>
          </>
        )}
      </HeaderWrap>
    </BaseHeader>
  );
};
