import { AbfahrtenList } from './Components/AbfahrtenList';
import { FavList } from './Components/FavList';
import { Route, Routes } from 'react-router';
import type { FC } from 'react';

export const AbfahrtenRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<FavList />} />
    <Route path="/:station/*" element={<AbfahrtenList />} />
  </Routes>
);
