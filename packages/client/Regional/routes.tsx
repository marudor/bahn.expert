import { AbfahrtenList } from 'client/Abfahrten/Components/AbfahrtenList';
import { RegionalMainPage } from 'client/Regional/Components/MainPage';
import loadable from '@loadable/component';

const DetailsRoute = loadable(() =>
  import('../Common/Components/Details/DetailsRoute')
);

export const routes = [
  {
    component: RegionalMainPage,
    exact: true,
    path: '/regional',
  },
  {
    path: '/regional/details/:train/:initialDeparture*',
    // eslint-disable-next-line react/display-name
    component: (props: any) => (
      <DetailsRoute {...props} urlPrefix="/regional/" />
    ),
  },
  {
    path: '/regional/:station',
    component: AbfahrtenList,
  },
];
