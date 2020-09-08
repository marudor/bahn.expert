import { FavEntryDisplay } from 'client/Abfahrten/Components/FavEntry';
import { FavList } from 'client/Abfahrten/Components/FavList';
import type { FC } from 'react';
import type { StaticRouterContext } from 'react-router';

interface Props {
  staticContext?: StaticRouterContext;
}

export const RegionalMainPage: FC<Props> = ({ staticContext }) => (
  <FavList staticContext={staticContext}>
    <FavEntryDisplay clickable={false} text="Nahverkehr Abfahrten <BETA>" />
  </FavList>
);
