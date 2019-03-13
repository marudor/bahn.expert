// @flow
import { green, red } from './colors';
export const cancelled = {
  textDecoration: 'line-through',
  textDecorationColor: 'black',
};

export const delayed = {
  color: red,
};
export const changed = delayed;
export const early = {
  color: green,
};
