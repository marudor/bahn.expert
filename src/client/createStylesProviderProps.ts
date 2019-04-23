import { createGenerateClassName } from '@material-ui/styles';

export default () => ({
  generateClassName: createGenerateClassName({
    productionPrefix: 'm',
  }),
});
