import { App } from './App';
import {
  createGenerateClassName,
  StylesProvider,
  ThemeProvider,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ReactNode, useMemo } from 'react';
import { ThemeHeaderTags } from 'client/Common/Components/ThemeHeaderTags';
import { useTheme } from 'client/Common/provider/ThemeProvider';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import type { SheetsRegistry } from 'jss';

interface Props {
  children?: ReactNode;
  sheetsRegistry?: SheetsRegistry;
  generateClassName?: ReturnType<typeof createGenerateClassName>;
}

export const ThemeWrap = ({
  children = <App />,
  sheetsRegistry,
  generateClassName,
}: Props) => {
  const { theme } = useTheme();

  const classNameGenerator = useMemo(
    () => generateClassName || createGenerateClassName(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <StylesProvider
      injectFirst
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
