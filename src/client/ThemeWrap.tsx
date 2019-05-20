import { CommonState } from 'AppState';
import { connect } from 'react-redux';
import { Rule, StyleSheet } from 'jss';
import { ThemeProvider } from '@material-ui/styles';
import { ThemeType } from './Themes/type';
import App from './App';
import createTheme from './Themes';
import React, { ReactNode, useMemo } from 'react';

interface StateProps {
  themeType: ThemeType;
}

interface OwnProps {
  children?: ReactNode;
}

type Props = StateProps & OwnProps;

const ThemeWrap = ({ themeType, children = <App /> }: Props) => {
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  const themeProvider = <ThemeProvider theme={theme}>{children}</ThemeProvider>;

  if (process.env.NODE_ENV === 'test') {
    const counter: any = {};
    const StylesProvider = require('@material-ui/styles').StylesProvider;
    const generateClassName = (rule: Rule, sheet?: StyleSheet<string>) => {
      // @ts-ignore
      const name = `${sheet.options.name}-${rule.key}`;

      // @ts-ignore
      if (!counter[rule]) counter[rule] = 0;

      // @ts-ignore
      // eslint-disable-next-line no-plusplus
      return `${name}-${counter[rule]++}`;
    };

    return (
      <StylesProvider generateClassName={generateClassName}>
        {themeProvider}
      </StylesProvider>
    );
  }

  return themeProvider;
};

export default connect<StateProps, OwnProps, {}, CommonState>(state => ({
  themeType: state.config.theme,
}))(ThemeWrap);
