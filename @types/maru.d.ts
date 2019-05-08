namespace Maru {
  import { CSSProperties } from '@material-ui/styles';

  interface Theme {
    colors: {
      green: string;
      red: string;
      background: string;
      text: string;
    };
    mixins: {
      cancelled: CSSProperties;
      delayed: CSSProperties;
      changed: CSSProperties;
      early: CSSProperties;
    };
    mui: {
      type: 'light' | 'dark';
    };
  }
}
