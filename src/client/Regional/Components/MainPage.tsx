import { FavEntryDisplay } from 'Abfahrten/Components/FavEntry';
import FavList from 'Abfahrten/Components/FavList';
import type { StaticRouterContext } from 'react-router';

interface Props {
  staticContext?: StaticRouterContext;
}

const RegionalMainPage = ({ staticContext }: Props) => (
  <FavList staticContext={staticContext}>
    <FavEntryDisplay clickable={false} text="Nahverkehr Abfahrten <BETA>" />
  </FavList>
);

export default RegionalMainPage;
