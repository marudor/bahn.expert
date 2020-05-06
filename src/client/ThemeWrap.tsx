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
import ThemeContainer from 'Common/container/ThemeContainer';
import ThemeHeaderTags from 'Common/Components/ThemeHeaderTags';
import type { Rule, SheetsRegistry, StyleSheet } from 'jss';

interface Props {
  children?: ReactNode;
  sheetsRegistry?: SheetsRegistry;
}

const ThemeWrap = ({ children = <App />, sheetsRegistry }: Props) => {
  const { theme } = ThemeContainer.useContainer();

  let generateClassName = useMemo(() => createGenerateClassName(), []);

  if (global.TEST) {
    generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
      // @ts-ignore
      const name = `${sheet.options.name}-${rule.key}`;

      return name;
    };
  }

  return (
    <StylesProvider
      sheetsRegistry={sheetsRegistry}
      generateClassName={generateClassName}
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
