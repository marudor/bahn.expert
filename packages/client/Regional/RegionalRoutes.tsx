import { AbfahrtenList } from 'client/Abfahrten/Components/AbfahrtenList';
import { RegionalMainPage } from 'client/Regional/Components/MainPage';
import { Route, Routes } from 'react-router';
import loadable from '@loadable/component';
import type { FC } from 'react';

const DetailsRoute = loadable(
  () => import('../Common/Components/Details/DetailsRoute'),
);

export const RegionalRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<RegionalMainPage />} />
    <Route
      path="/details/:train/:initialDeparture/*"
      element={<DetailsRoute urlPrefix="/regional/" />}
    />
    <Route
      path="/details/:train"
      element={<DetailsRoute urlPrefix="/regional/" />}
    />
    <Route path="/:station" element={<AbfahrtenList />} />
  </Routes>
);
