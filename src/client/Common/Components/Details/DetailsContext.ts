import { createContext } from 'react';
import type { AxiosError } from 'axios';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

export const DetailsContext = createContext<{
  details?: ParsedSearchOnTripResponse;
  error?: AxiosError;
  urlPrefix?: string;
  refresh?: () => any;
}>({});
