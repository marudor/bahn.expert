import { css } from '@mui/material';
import type { Interpolation, Theme } from '@mui/material';

type Mixin = (theme: Theme) => Interpolation<unknown>;

export const themeMixins = {
  additional: ((theme) => ({
    color: `${theme.vars.palette.common.green}!important`,
  })) satisfies Mixin,
  cancelled: ((theme) => ({
    textDecoration: 'line-through',
    textDecorationColor: theme.vars.palette.text.primary,
  })) satisfies Mixin,
  delayed: ((theme) => ({
    color: theme.vars.palette.common.red,
  })) satisfies Mixin,
  changed: ((theme) => ({
    color: `${theme.vars.palette.common.red}!important`,
  })) satisfies Mixin,
  early: ((theme) => ({
    color: theme.vars.palette.common.green,
  })) satisfies Mixin,
  singleLineText: css`
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  stripe: css`
    position: absolute;
    top: -1.4em;
    height: 1.3em;
    left: -1;
    right: -1;
    opacity: 0.8;
  `,
};
