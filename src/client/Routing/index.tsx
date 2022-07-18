import { Header } from './Components/Header';
import { RoutingConfigProvider } from 'client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from 'client/Routing/provider/RoutingFavProvider';
import { RoutingRoutes } from 'client/Routing/RoutingRoutes';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.5em;
`;

export const Routing: FC = () => (
  <RoutingConfigProvider>
    <RoutingFavProvider>
      <Container>
        <Header />
        <RoutingRoutes />
      </Container>
    </RoutingFavProvider>
  </RoutingConfigProvider>
);
// eslint-disable-next-line import/no-default-export
export default Routing;
