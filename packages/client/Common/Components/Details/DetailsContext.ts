import { createContext } from 'react';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { ResponseError } from 'umi-request';

export default createContext<{
  details?: ParsedSearchOnTripResponse;
  error?: ResponseError;
  urlPrefix?: string;
}>({});
