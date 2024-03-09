import { Stack, styled } from '@mui/material';
import { useQuery } from '@/client/Common/hooks/useQuery';
import type { FC, ReactNode } from 'react';

const Container = styled(Stack, {
  shouldForwardProp: (n) => n !== 'noHeader',
})<{ noHeader?: boolean }>(
  ({ noHeader, theme }) =>
    noHeader && {
      marginTop: `-${theme.shape.headerSpacing}`,
    },
);
interface Props {
  children: ReactNode;
}

export const MainWrap: FC<Props> = ({ children }) => {
  const noHeader = Boolean(useQuery().noHeader);

  return <Container noHeader={noHeader}>{children}</Container>;
};
