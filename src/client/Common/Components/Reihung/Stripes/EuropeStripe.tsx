import styled from '@emotion/styled';

export const EuropeStripe = styled.div(
  ({ theme }) => ({
    background: theme.colors.europe,
  }),
  ({ theme }) => theme.mixins.stripe,
);
