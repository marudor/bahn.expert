// @flow
import React from 'react';
import type { Abfahrt } from 'types/abfahrten';

type context = {
  abfahrt: Abfahrt,
  detail: boolean,
};

// $FlowFixMe
const defaultValue: context = {
  detail: false,
};

export default React.createContext(defaultValue);
