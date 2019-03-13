// @flow
// $FlowFixMe
import { SheetsRegistry } from 'jss';
// $FlowFixMe
import { createGenerateClassName } from '@material-ui/core/styles';

export default () => ({
  generateClassName: createGenerateClassName(),
  registry: global.SERVER ? new SheetsRegistry() : undefined,
});
