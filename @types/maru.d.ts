declare module 'maru' {
  import { CSSProperties } from '@material-ui/styles';
  import { PaletteColor } from '@material-ui/core/styles/createPalette';

  interface Theme {
    colors: {
      green: string;
      red: string;
      yellow: string;
      orange: string;
    };
    mixins: {
      cancelled: CSSProperties;
      delayed: CSSProperties;
      changed: CSSProperties;
      early: CSSProperties;
    };
  }
}
