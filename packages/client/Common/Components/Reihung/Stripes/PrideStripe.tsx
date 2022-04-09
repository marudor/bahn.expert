import styled from '@emotion/styled';

export const PrideStripe = styled.div(
  ({ theme }) => ({
    background: theme.colors.pride,
  }),
  ({ theme }) => theme.mixins.stripe,
);
