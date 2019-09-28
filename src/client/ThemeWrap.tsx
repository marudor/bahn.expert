import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Rule, StyleSheet } from 'jss';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import DateFnsUtils from '@date-io/date-fns';
import deLocale from 'date-fns/locale/de';
import React, { ReactNode } from 'react';
import ThemeContainer from 'Common/container/ThemeContainer';
import ThemeHeaderTags from 'Common/Components/ThemeHeaderTags';

interface Props {
  children?: ReactNode;
}

const ThemeWrap = ({ children = <App /> }: Props) => {
  const { theme } = ThemeContainer.useContainer();

  const themeProvider = (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={deLocale}>
      <ThemeProvider theme={theme}>
        <ThemeHeaderTags />
        {children}
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );

  if (global.TEST) {
    const StylesProvider = require('@material-ui/styles').StylesProvider;
    const generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
      // @ts-ignore
      const name = `${sheet.options.name}-${rule.key}`;

      return name;
    };

    return (
      <StylesProvider generateClassName={generateClassName}>
        {themeProvider}
      </StylesProvider>
    );
  }

  return themeProvider;
};

export default ThemeWrap;
