import styled from 'styled-components/macro';

export const TrainInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const TrainMargin = styled.span`
  flex: 0.7;
  margin-right: 0.5em;
  display: flex;
  flex-direction: column;
`;

export const Destination = styled(TrainMargin)`
  flex: 1;
`;
