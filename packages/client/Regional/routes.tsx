import { AbfahrtenList } from 'client/Abfahrten/Components/AbfahrtenList';
import { RegionalMainPage } from 'client/Regional/Components/MainPage';
import loadable from '@loadable/component';
import type { FC } from 'react';

const DetailsRoute = loadable(
  () => import('../Common/Components/Details/DetailsRoute'),
);

export const routes = [
  {
    component: RegionalMainPage,
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/details/:train/:initialDeparture*',
    component: ((props: any) => (
      <DetailsRoute {...props} urlPrefix="/regional/" />
    )) as FC,
  },
  {
    path: '/regional/:station',
    component: AbfahrtenList,
  },
];
