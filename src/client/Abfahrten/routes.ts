import AbfahrtenList from './Components/AbfahrtenList';
import About from './Components/About';
import FavList from './Components/FavList';

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
