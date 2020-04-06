import AbfahrtenList from 'Abfahrten/Components/AbfahrtenList';
import MainPage from 'Regional/Components/MainPage';

export default [
  {
    component: MainPage,
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/:station',
    component: AbfahrtenList,
  },
];
