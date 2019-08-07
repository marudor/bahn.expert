import { NoSsr } from '@material-ui/core';
import AbfahrtenList from './Components/AbfahrtenList';
import FavList from './Components/FavList';
import React from 'react';

const About = React.lazy(() => import('./Components/About'));

export default [
  {
    component: FavList,
    exact: true,
    path: '/',
  },
  {
    // eslint-disable-next-line react/display-name
    component: () => (
      <NoSsr>
        <React.Suspense fallback="loading">
          <About />
        </React.Suspense>
      </NoSsr>
    ),
    exact: true,
    path: '/about',
  },
  {
    path: '/:station',
    component: AbfahrtenList,
  },
];
