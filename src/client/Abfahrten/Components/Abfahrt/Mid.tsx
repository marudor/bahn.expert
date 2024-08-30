import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { styled } from '@mui/material';
import type { FC } from 'react';
import { Info } from './Info';

const Wrapper = styled('div')<{ detail: boolean }>({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	justifyContent: 'space-around',
	overflow: 'hidden',
	variants: [
		{
			props: ({ detail }) => !detail,
			style: {
				whiteSpace: 'nowrap',
			},
		},
	],
});

const Destination = styled('div')<{
	cancelled?: boolean;
	different?: boolean;
}>(
	{
		fontSize: '4em',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	{
		variants: [
			{
				props: { cancelled: true },
				style: ({ theme }) => theme.mixins.cancelled,
			},
			{
				props: { different: true },
				style: ({ theme }) => theme.mixins.changed,
			},
		],
	},
);

export const Mid: FC = () => {
	const { abfahrt, detail } = useAbfahrt();
	return (
		<Wrapper detail={detail} data-testid="abfahrtMid">
			<Info />
			<Destination
				cancelled={abfahrt.cancelled}
				different={
					!abfahrt.cancelled &&
					abfahrt.destination !== abfahrt.scheduledDestination
				}
				data-testid="destination"
			>
				{abfahrt.cancelled ? abfahrt.scheduledDestination : abfahrt.destination}
			</Destination>
		</Wrapper>
	);
};
