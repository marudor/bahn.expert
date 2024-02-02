import { Stack } from '@mui/material';
import styled from '@emotion/styled';
import type { FC, ReactNode } from 'react';

const Container = styled(Stack)<{ noHeader?: boolean }>(
  ({ noHeader, theme }) =>
    noHeader && {
      marginTop: `-${theme.shape.headerSpacing}`,
    },
);
interface Props {
  noHeader?: boolean;
  children: ReactNode;
}

export const MainWrap: FC<Props> = ({ noHeader, children }) => {
  return (
    <Container direction="column" noHeader={noHeader}>
      {children}
    </Container>
  );
};
