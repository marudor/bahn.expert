import loadable from 'client/loadable';

export default [
  {
    component: loadable(() => import('client/Regional/Components/MainPage')),
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/details/:train/:initialDeparture*',
    component: loadable(() =>
      import('client/Regional/Components/RegionalDetailsRoute')
    ),
  },
  {
    path: '/regional/:station',
    component: loadable(() =>
      import('client/Abfahrten/Components/AbfahrtenList')
    ),
  },
];
