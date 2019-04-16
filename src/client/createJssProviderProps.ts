import { createGenerateClassName } from '@material-ui/core/styles';
import { SheetsRegistry } from 'jss';

export default () => ({
  generateClassName: createGenerateClassName(),
  registry: global.SERVER ? new SheetsRegistry() : undefined,
});
