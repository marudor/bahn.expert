import { AbfahrtenList } from './Components/AbfahrtenList';
import { FavList } from './Components/FavList';

export const routes = [
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
