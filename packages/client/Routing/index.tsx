import { Header } from './Components/Header';
import { renderRoutes } from 'react-router-config';
import { routes } from './routes';
import { RoutingFavProvider } from 'client/Routing/container/RoutingFavContainer';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Routing = () => (
  <RoutingFavProvider>
    <Wrapper>
      <Header />
      {renderRoutes(routes)}
    </Wrapper>
  </RoutingFavProvider>
);
// eslint-disable-next-line import/no-default-export
export default Routing;
