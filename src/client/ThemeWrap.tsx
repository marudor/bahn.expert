import { CommonState } from 'AppState';
import { connect } from 'react-redux';
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

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default connect<StateProps, OwnProps, {}, CommonState>(state => ({
  themeType: state.config.theme,
}))(ThemeWrap);
