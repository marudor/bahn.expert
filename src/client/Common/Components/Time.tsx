import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { Stack, styled } from '@mui/material';
import { format, subMinutes } from 'date-fns';
import type { FC } from 'react';

const Container = styled(Stack, {
	shouldForwardProp: (p) =>
		p !== 'early' && p !== 'delayed' && p !== 'cancelled' && p !== 'multiLine',
})<{
	early?: boolean;
	delayed?: boolean;
	cancelled?: boolean;
	multiLine?: boolean;
}>(
	{
		fontSize: '0.9em',
	},
	{
		variants: [
			{
				props: { early: true },
				style: ({ theme }) => theme.mixins.early,
			},
			{
				props: { delayed: true },
				style: ({ theme }) => theme.mixins.delayed,
			},
			{
				props: { cancelled: true },
				style: ({ theme }) => theme.mixins.cancelled,
			},
			{
				props: ({ multiLine }) => !multiLine,
				style: {
					flexDirection: 'row',
				},
			},
		],
	},
);

const TimeContainer = styled('span')<{
	isRealTime?: boolean;
	early?: boolean;
	delayed?: boolean;
	multiLine?: boolean;
	isPlan?: boolean;
}>({
	variants: [
		{
			props: ({ multiLine }) => !multiLine,
			style: {
				marginRight: '.2em',
			},
		},
		{
			props: { isRealTime: true },
			style: { fontWeight: 'bold' },
		},
		{
			props: { isPlan: true },
			style: { fontStyle: 'italic' },
		},
		{
			props: { early: true },
			style: ({ theme }) => theme.mixins.early,
		},
		{
			props: { delayed: true },
			style: ({ theme }) => theme.mixins.delayed,
		},
	],
});

interface Props {
	className?: string;
	delay?: number;
	real?: Date;
	cancelled?: boolean;
	/** Not Schedule, not preview */
	isRealTime?: boolean;
	multiLine?: boolean;
	// sourceo of Information is no realTime API but static
	isPlan?: boolean;
}

function delayString(delay: number) {
	if (delay < 0) {
		return `-${Math.abs(delay)}`;
	}

	return `+${delay}`;
}

export const Time: FC<Props> = ({
	className,
	delay,
	real,
	cancelled,
	isRealTime,
	multiLine,
	isPlan,
}) => {
	const showDelayTime = useCommonConfig().delayTime;
	if (!real) return null;
	const hasDelay = delay != null;
	// Wenn mit Delay dann immer Echtzeit, sonst plan
	const timeToDisplay = showDelayTime
		? real
		: hasDelay
			? subMinutes(real, delay)
			: real;

	return (
		<Container
			data-testid="timeContainer"
			className={className}
			cancelled={cancelled}
			multiLine={multiLine}
		>
			<TimeContainer
				multiLine={multiLine}
				data-testid="timeToDisplay"
				early={showDelayTime && hasDelay && delay <= 0}
				delayed={showDelayTime && hasDelay && delay > 0}
				isPlan={isPlan}
			>
				{format(timeToDisplay, 'HH:mm')}
			</TimeContainer>
			{hasDelay && !cancelled && (
				<TimeContainer
					multiLine={multiLine}
					data-testid="realTimeOrDelay"
					isRealTime={isRealTime}
					early={delay <= 0}
					delayed={delay > 0}
				>
					{showDelayTime ? delayString(delay) : format(real, 'HH:mm')}
				</TimeContainer>
			)}
		</Container>
	);
};
