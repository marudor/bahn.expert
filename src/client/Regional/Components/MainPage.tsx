import { FavEntryDisplay } from '@/client/Abfahrten/Components/FavEntry';
import { FavList } from '@/client/Abfahrten/Components/FavList';
import type { FC } from 'react';
import type { StaticRouterContext } from 'react-router';

interface Props {
  staticContext?: StaticRouterContext;
}

export const RegionalMainPage: FC<Props> = ({ staticContext }) => (
  <>
    <FavList staticContext={staticContext}>
      <FavEntryDisplay nonClickable text="Nahverkehr Abfahrten" />
    </FavList>
  </>
);
