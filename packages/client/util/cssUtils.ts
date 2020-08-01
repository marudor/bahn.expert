import { css } from 'styled-components';

export const singleLineText = css`
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const cancelledCss = css`
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.palette.text.primary};
`;

export const delayCss = css`
  color: ${({ theme }) => theme.colors.red};
`;

export const changedCss = delayCss;

export const additionalCss = css`
  color: ${({ theme }) => theme.colors.green};
`;
export const earlyCss = additionalCss;
