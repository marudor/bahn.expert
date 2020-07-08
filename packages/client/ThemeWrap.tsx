import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ReactNode, useMemo } from 'react';
import App from './App';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import ThemeContainer from 'client/Common/container/ThemeContainer';
import ThemeHeaderTags from 'client/Common/Components/ThemeHeaderTags';
import type { SheetsRegistry } from 'jss';

interface Props {
  children?: ReactNode;
  sheetsRegistry?: SheetsRegistry;
  generateClassName?: ReturnType<typeof createGenerateClassName>;
}

const ThemeWrap = ({
  children = <App />,
  sheetsRegistry,
  generateClassName,
}: Props) => {
  const { theme } = ThemeContainer.useContainer();

  const classNameGenerator = useMemo(
    () => generateClassName || createGenerateClassName(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StylesProvider
      sheetsRegistry={sheetsRegistry}
      generateClassName={classNameGenerator}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
        <ThemeProvider theme={theme}>
          <ThemeHeaderTags />
          {children}
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    </StylesProvider>
  );
};

export default ThemeWrap;
