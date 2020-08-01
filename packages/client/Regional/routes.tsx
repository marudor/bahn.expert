import { AbfahrtenList } from 'client/Abfahrten/Components/AbfahrtenList';
import { RegionalDetailRoute } from 'client/Regional/Components/RegionalDetailsRoute';
import { RegionalMainPage } from 'client/Regional/Components/MainPage';

export const routes = [
  {
    component: RegionalMainPage,
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/details/:train/:initialDeparture*',
    component: RegionalDetailRoute,
  },
  {
    path: '/regional/:station',
    component: AbfahrtenList,
  },
];
