import { AxiosError } from 'axios';
import { createContext } from 'react';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

export default createContext<{
  details?: ParsedSearchOnTripResponse;
  error?: AxiosError;
}>({});
