import loadable from 'client/loadable';

export default [
  {
    component: loadable(() => import('./Components/FavList')),
    exact: true,
    path: '/',
  },
  {
    path: '/:station',
    component: loadable(() => import('./Components/AbfahrtenList')),
  },
];
