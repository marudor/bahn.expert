declare module 'maru' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { SerializedStyles } from '@mui/material';

  interface Mixins {
    cancelled: SerializedStyles;
    delayed: SerializedStyles;
    changed: SerializedStyles;
    additional: SerializedStyles;
    early: SerializedStyles;
    singleLineText: SerializedStyles;
    stripe: SerializedStyles;
  }
  interface Theme {
    colors: {
      green: string;
      red: string;
      yellow: string;
      orange: string;
      blue: string;
      shadedBackground: string;
      transparentBackground: string;
      pride: string;
      europe: string;
    };
    mixins: Mixins;
  }
}
