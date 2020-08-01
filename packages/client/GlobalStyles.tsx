import { createGlobalStyle, css } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body {
    height: 100%;
  }
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  body {
    margin: 0;
    font-family: Roboto, sans-serif;
    ${({ theme }) => css`
      background-color: ${theme.palette.background.default};
      color: ${theme.palette.text.primary};
    `}
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.blue};
  }
  main {
    margin-top: ${({ theme }) => theme.shape.headerSpacing}px;
  }
`;
