import { styled } from '@mui/material';

export const PrideStripe = styled('div')(({ theme }) => ({
	background: theme.vars.palette.common.pride,
	position: 'absolute',
	top: '-1.4em',
	height: '1.3em',
	left: -1,
	right: -1,
	opacity: 0.8,
}));
