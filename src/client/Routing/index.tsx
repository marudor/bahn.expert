import { Header } from './Components/Header';
import { RoutingConfigProvider } from '@/client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from '@/client/Routing/provider/RoutingFavProvider';
import { RoutingRoutes } from '@/client/Routing/RoutingRoutes';
import { Stack } from '@mui/material';
import type { FC } from 'react';

export const Routing: FC = () => (
  <RoutingConfigProvider>
    <RoutingFavProvider>
      <Stack direction="column" padding="0 .5em">
        <Header />
        <RoutingRoutes />
      </Stack>
    </RoutingFavProvider>
  </RoutingConfigProvider>
);
// eslint-disable-next-line import/no-default-export
export default Routing;
