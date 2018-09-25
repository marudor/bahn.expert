// @flow
import React from 'react';
import type { FahrzeugType, SpecificType } from 'types/reihung';
export type Context = {
  specificType: ?SpecificType,
  type: FahrzeugType,
};

const defaultValue: Context = {
  specificType: null,
  type: 'IC',
};

export default React.createContext(defaultValue);
