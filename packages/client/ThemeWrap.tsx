import { App } from './App';
import {
  createGenerateClassName,
  ThemeProvider as MUIThemeProvider,
  StylesProvider,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ReactNode, useMemo } from 'react';
import { ThemeContainer } from 'client/Common/container/ThemeContainer';
import { ThemeHeaderTags } from 'client/Common/Components/ThemeHeaderTags';
import { ThemeProvider } from 'styled-components';
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
  const { theme } = ThemeContainer.useContainer();

  const classNameGenerator = useMemo(
    () => generateClassName || createGenerateClassName(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <StylesProvider
      injectFirst
      sheetsRegistry={sheetsRegistry}
      generateClassName={classNameGenerator}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
        <MUIThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <ThemeHeaderTags />
            {children}
          </ThemeProvider>
        </MUIThemeProvider>
      </MuiPickersUtilsProvider>
    </StylesProvider>
  );
};
