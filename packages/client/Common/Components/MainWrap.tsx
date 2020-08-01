import styled, { css } from 'styled-components';

export const MainWrap = styled.div<{ noHeader?: boolean }>`
  ${({ theme, noHeader }) =>
    noHeader &&
    css`
      margin-top: -${theme.shape.headerSpacing}px};
  `};
  display: flex;
  flex-direction: column;
`;
