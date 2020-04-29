import { FavEntryDisplay } from 'Abfahrten/Components/FavEntry';
import { StaticRouterContext } from 'react-router';
import FavList from 'Abfahrten/Components/FavList';

interface Props {
  staticContext?: StaticRouterContext;
}

const RegionalMainPage = ({ staticContext }: Props) => (
  <FavList staticContext={staticContext}>
    <FavEntryDisplay clickable={false} text="Nahverkehr Abfahrten <BETA>" />
  </FavList>
);

export default RegionalMainPage;
