import { Refresh } from '@mui/icons-material';
import { keyframes, styled } from '@mui/material';

const spinKeyframe = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

export const RefreshIconWithSpin = styled(Refresh)<{ loading?: boolean }>({
	variants: [
		{
			props: { loading: true },
			style: {
				animation: `${spinKeyframe} 2s infinite ease-in-out`,
			},
		},
	],
});
