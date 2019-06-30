import { Route$JourneySegment } from 'types/routing';
import React from 'react';

export default React.createContext<Route$JourneySegment | undefined>(undefined);
