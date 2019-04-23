namespace Maru {
  import { CSSProperties } from '@material-ui/styles';

  interface Theme {
    colors: {
      green: string;
      red: string;
    };
    mixins: {
      cancelled: CSSProperties;
      delayed: CSSProperties;
      changed: CSSProperties;
      early: CSSProperties;
    };
  }
}
