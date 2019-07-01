import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import React from 'react';

export default React.createContext<ParsedSearchOnTripResponse | undefined>(
  undefined
);
