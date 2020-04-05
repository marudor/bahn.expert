import AbfahrtenList from 'Abfahrten/Components/AbfahrtenList';
import FavList from 'Regional/Components/FavList';

export default [
  {
    component: FavList,
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/:station',
    component: AbfahrtenList,
  },
];
