import styled from '@emotion/styled';

export const GermanyStripe = styled.div(
  ({ theme }) => ({
    background: theme.colors.germany,
  }),
  ({ theme }) => theme.mixins.stripe,
);
