import AbfahrtenList from './Components/AbfahrtenList';
import FavList from './Components/FavList';
import loadable from '@loadable/component';

const About = loadable(() => import('./Components/About'));

export default [
  {
    component: FavList,
    exact: true,
    path: '/',
  },
  {
    component: About,
    exact: true,
    path: '/about',
  },
  {
    path: '/:station',
    component: AbfahrtenList,
  },
];
