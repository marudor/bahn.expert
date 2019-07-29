import { AxiosError } from 'axios';
import { DetailResponse } from 'server/HAFAS/Detail';
import React from 'react';

export default React.createContext<{
  details?: DetailResponse;
  error?: AxiosError;
}>({});
