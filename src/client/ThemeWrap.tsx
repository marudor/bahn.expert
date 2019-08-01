import { Rule, StyleSheet } from 'jss';
import { ThemeProvider } from '@material-ui/styles';
import { useCommonSelector } from 'useSelector';
import App from './App';
import createTheme from './Themes';
import React, { ReactNode, useMemo } from 'react';
import ThemeHeaderTags from 'Common/Components/ThemeHeaderTags';

interface Props {
  children?: ReactNode;
}

const ThemeWrap = ({ children = <App /> }: Props) => {
  const themeType = useCommonSelector(state => state.config.theme);
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  const themeProvider = (
    <ThemeProvider theme={theme}>
      <ThemeHeaderTags />
      {children}
    </ThemeProvider>
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
