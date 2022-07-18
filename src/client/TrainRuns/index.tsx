import { Header } from 'client/TrainRuns/Components/Header';
import { TrainRunProvider } from 'client/TrainRuns/provider/TrainRunProvider';
import { TrainRunRoutes } from 'client/TrainRuns/TrainRunRoutes';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.main`
  height: 100%;
`;

export const TrainRuns: FC = () => (
  <TrainRunProvider>
    <Header />
    <Container>
      <TrainRunRoutes />
    </Container>
  </TrainRunProvider>
);

// eslint-disable-next-line import/no-default-export
export default TrainRuns;
