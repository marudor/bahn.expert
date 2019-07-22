import { CommonState } from 'AppState';
import { connect } from 'react-redux';
import { Rule, StyleSheet } from 'jss';
import { ThemeProvider } from '@material-ui/styles';
import { ThemeType } from './Themes/type';
import App from './App';
import createTheme from './Themes';
import React, { ReactNode, useMemo } from 'react';
import ThemeHeaderTags from 'Common/Components/ThemeHeaderTags';

interface StateProps {
  themeType: ThemeType;
}

interface OwnProps {
  children?: ReactNode;
}

type Props = StateProps & OwnProps;

const ThemeWrap = ({ themeType, children = <App /> }: Props) => {
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  const themeProvider = (
    <ThemeProvider theme={theme}>
      <ThemeHeaderTags />
      {children}
    </ThemeProvider>
  );

  if (process.env.NODE_ENV === 'test') {
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

export default connect<StateProps, OwnProps, {}, CommonState>(state => ({
  themeType: state.config.theme,
}))(ThemeWrap);
