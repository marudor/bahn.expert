declare module 'maru' {
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { CSSProperties } from '@material-ui/styles';
  interface Theme {
    colors: {
      green: string;
      red: string;
      yellow: string;
      orange: string;
      blue: string;
      shadedBackground: string;
      transparentBackground: string;
    };
    mixins: {
      cancelled: CSSProperties;
      delayed: CSSProperties;
      changed: CSSProperties;
      additional: CSSProperties;
      early: CSSProperties;
      singleLineText: CSSProperties;
    };
  }
}
