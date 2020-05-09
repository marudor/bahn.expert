import AbfahrtenList from 'client/Abfahrten/Components/AbfahrtenList';
import MainPage from 'client/Regional/Components/MainPage';
import RegionalDetailRoute from 'client/Regional/Components/RegionalDetailsRoute';

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
