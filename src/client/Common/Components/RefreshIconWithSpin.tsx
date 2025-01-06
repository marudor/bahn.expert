import Refresh from '@mui/icons-material/Refresh';
import { keyframes, styled } from '@mui/material';

const spinKeyframe = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

export const RefreshIconWithSpin = styled(Refresh, {
	shouldForwardProp: (p) => p !== 'loading',
})<{ loading?: boolean }>({
	variants: [
		{
			props: { loading: true },
			style: {
				animation: `${spinKeyframe} 2s infinite ease-in-out`,
			},
		},
	],
});
