import { styled } from '@mui/material';
import { themeMixins } from '@/client/Themes/mixins';

export const PrideStripe = styled('div')(
  ({ theme }) => ({
    background: theme.vars.palette.common.pride,
  }),
  themeMixins.stripe,
);
