import { useAbfahrt } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { Time } from '@/client/Common/Components/Time';
import { styled } from '@mui/material';
import type { FC } from 'react';

const TimeContainer = styled('div')<{ cancelled?: boolean }>(
	({ theme }) => ({
		display: 'flex',
		justifyContent: 'flex-end',
		'& > span': {
			color: theme.vars.palette.text.primary,
			whiteSpace: 'pre-wrap',
		},
	}),
	{
		variants: [
			{
				props: { cancelled: true },
				style: ({ theme }) => theme.mixins.cancelled,
			},
		],
	},
);

export const Times: FC = () => {
	const {
		abfahrt: { cancelled, arrival, departure },
		detail,
	} = useAbfahrt();

	return (
		<div data-testid="times">
			{detail ? (
				<>
					{arrival && (
						<TimeContainer
							cancelled={arrival.cancelled || cancelled}
							data-testid="arrivalTimeContainer"
						>
							<span>{'An: '}</span>
							<Time
								multiLine
								delay={arrival.delay}
								real={arrival.time}
								isRealTime={arrival.isRealTime}
							/>
						</TimeContainer>
					)}
					{departure && (
						<TimeContainer
							cancelled={departure.cancelled || cancelled}
							data-testid="departureTimeContainer"
						>
							<span>{'Ab: '}</span>
							<Time
								multiLine
								delay={departure.delay}
								real={departure.time}
								isRealTime={departure.isRealTime}
							/>
						</TimeContainer>
					)}
				</>
			) : departure && (!departure.cancelled || cancelled) ? (
				<Time
					multiLine
					delay={departure.delay}
					real={departure.time}
					cancelled={cancelled}
					isRealTime={departure.isRealTime}
				/>
			) : (
				arrival && (
					<Time
						multiLine
						delay={arrival.delay}
						real={arrival.time}
						cancelled={cancelled}
						isRealTime={arrival.isRealTime}
					/>
				)
			)}
		</div>
	);
};
