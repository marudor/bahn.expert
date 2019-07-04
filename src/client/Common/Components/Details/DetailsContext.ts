import { AxiosError } from 'axios';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import React from 'react';

export default React.createContext<{
  details?: ParsedSearchOnTripResponse;
  error?: AxiosError;
}>({});
