import { themeMixins } from '@/client/Themes/mixins';
import { styled } from '@mui/material';

export const PrideStripe = styled('div')(
	({ theme }) => ({
		background: theme.vars.palette.common.pride,
	}),
	themeMixins.stripe,
);
