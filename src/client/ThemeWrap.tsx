import { CommonState } from 'AppState';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import App from './App';
import createTheme, { ThemeType } from './Themes';
import React, { useMemo } from 'react';

interface StateProps {
  themeType: ThemeType;
}

type Props = StateProps;

const ThemeWrap = ({ themeType }: Props) => {
  const theme = useMemo(() => createTheme(themeType), [themeType]);

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default connect<StateProps, {}, {}, CommonState>(state => ({
  themeType: state.config.theme,
}))(ThemeWrap);
