import { styled } from '@mui/material';

export const PrideStripe = styled('div')(
  ({ theme }) => ({
    background: theme.colors.pride,
  }),
  ({ theme }) => theme.mixins.stripe,
);
