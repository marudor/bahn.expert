import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { themeMixins } from '@/client/Themes/mixins';
import { styled } from '@mui/material';
import type { FC } from 'react';
import { Info } from './Info';

const Wrapper = styled('div')<{ detail: boolean }>(({ detail }) => ({
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	justifyContent: 'space-around',
	overflow: 'hidden',
	whiteSpace: detail ? undefined : 'nowrap',
}));

const Destination = styled('div')<{
	cancelled?: boolean;
	different?: boolean;
}>(
	{
		fontSize: '4em',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	({ theme, cancelled }) => cancelled && themeMixins.cancelled(theme),
	({ theme, different }) => different && themeMixins.changed(theme),
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
