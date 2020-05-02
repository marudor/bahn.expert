import AbfahrtenList from 'Abfahrten/Components/AbfahrtenList';
import MainPage from 'Regional/Components/MainPage';
import RegionalDetailRoute from 'Regional/Components/RegionalDetailsRoute';

export default [
  {
    component: MainPage,
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
