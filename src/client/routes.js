// @flow
import AbfahrtenList from './Components/AbfahrtenList';
import FavList from './Components/FavList';
import Header from './Components/Header';

export default [
  {
    component: Header,
    path: '/',
  },
  {
    component: FavList,
    exact: true,
    path: '/',
  },
  {
    path: '/:station',
    component: AbfahrtenList,
  },
];
