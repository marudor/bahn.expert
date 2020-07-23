import { renderRoutes } from 'react-router-config';
import { RoutingFavProvider } from 'client/Routing/container/RoutingFavContainer';
import Header from './Components/Header';
import routes from './routes';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Routing = () => (
  <RoutingFavProvider>
    <Wrapper>
      <Header />
      {renderRoutes(routes)}
    </Wrapper>
  </RoutingFavProvider>
);

export default Routing;
