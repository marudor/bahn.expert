import { FavEntryDisplay } from 'Abfahrten/Components/FavEntry';
import React from 'react';

const RegionalFavList = () => {
  return (
    <main>
      <FavEntryDisplay clickable={false} text="Nahverkehr Abfahrten <BETA>" />
    </main>
  );
};

export default RegionalFavList;
