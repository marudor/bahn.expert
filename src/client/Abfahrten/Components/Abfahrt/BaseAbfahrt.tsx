import { useSetSelectedDetail } from '@/client/Abfahrten/provider/SelectedDetailProvider';
import type { FallbackTrainsForCoachSequence } from '@/client/Common/hooks/useCoachSequence';
import type { Abfahrt } from '@/types/iris';
import loadable from '@loadable/component';
import { Paper, Stack, styled } from '@mui/material';
import { createContext, useCallback, useContext, useMemo } from 'react';
import type { FC } from 'react';
import { End } from './End';
import { Mid } from './Mid';
import { Start } from './Start';

const LazyCoachSequence = loadable(
	() => import('../../../Common/Components/CoachSequence/CoachSequence'),
);

interface AbfahrtContextValues {
	abfahrt: Abfahrt;
	detail: boolean;
}

// @ts-expect-error default context not needed
export const AbfahrtContext = createContext<AbfahrtContextValues>();
export const useAbfahrt = (): AbfahrtContextValues =>
	useContext(AbfahrtContext);

const Container = styled(Paper)`
  line-height: 1.2;
  flex-shrink: 0;
  margin-top: 0.3em;
  overflow: visible;
  padding: 0 0.5em;
  position: relative;
`;

const WingIndicator = styled('span')<{
	wingEnd?: boolean;
	wingStart?: boolean;
}>(
	{
		variants: [
			{
				props: { wingStart: true },
				style: ({ theme }) => ({
					top: 0,
					bottom: '.3em',
					'&::before': {
						content: '" "',
						borderLeft: `1em solid ${theme.vars.palette.text.primary}`,
						position: 'absolute',
						height: '1px',
					},
				}),
			},
			{
				props: { wingEnd: true },
				style: ({ theme }) => ({
					top: '-1em',
					bottom: '.3em',
					'&::after': {
						content: '" "',
						borderLeft: `1em solid ${theme.vars.palette.text.primary}`,
						position: 'absolute',
						height: '1px',
						bottom: 0,
					},
				}),
			},
		],
	},
	({ theme }) => ({
		position: 'absolute',
		borderLeft: `1px solid ${theme.vars.palette.text.primary}`,
		content: '" "',
		left: '.3em',
	}),
);

const Entry = styled('div')(({ theme }) => ({
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	flexShrink: 0,
	fontSize: '.6em',
	userSelect: 'none',
	[theme.breakpoints.down('md')]: {
		fontSize: '.36em',
	},
}));

const ScrollMarker = styled('div')`
  position: absolute;
  top: -64px;
`;

export interface Props {
	abfahrt: Abfahrt;
	detail: boolean;
	sameTrainWing: boolean;
	wings?: FallbackTrainsForCoachSequence[];
	wingEnd?: boolean;
	wingStart?: boolean;
}

export const BaseAbfahrt: FC<Props> = ({
	abfahrt,
	wings,
	wingEnd,
	wingStart,
	detail,
}) => {
	const wingsWithoutSelf = useMemo(
		() => wings?.filter((wn) => wn.number !== abfahrt.train.number),
		[wings, abfahrt.train.number],
	);
	const setSelectedDetail = useSetSelectedDetail();
	const handleClick = useCallback(() => {
		setSelectedDetail(abfahrt.id);
	}, [abfahrt.id, setSelectedDetail]);
	const contextValue = useMemo(
		() => ({
			detail,
			abfahrt,
		}),
		[detail, abfahrt],
	);

	return (
		<AbfahrtContext.Provider value={contextValue}>
			<Container square id={`${abfahrt.id}container`} onClick={handleClick}>
				{wings && <WingIndicator wingEnd={wingEnd} wingStart={wingStart} />}
				<Entry
					data-testid={`abfahrt${abfahrt.train.type}${abfahrt.train.number}`}
				>
					<Stack direction="row">
						<Start />
						<Mid />
						<End />
					</Stack>
					{detail && abfahrt.departure && (
						<LazyCoachSequence
							trainNumber={abfahrt.train.number}
							trainCategory={abfahrt.train.type}
							currentEvaNumber={abfahrt.currentStopPlace.evaNumber}
							initialDeparture={abfahrt.initialDeparture}
							scheduledDeparture={abfahrt.departure.scheduledTime}
							administration={abfahrt.train.admin}
							fallbackWings={wingsWithoutSelf}
						/>
					)}
					{detail && (
						<ScrollMarker data-testid="scrollMarker" id={abfahrt.id} />
					)}
				</Entry>
			</Container>
		</AbfahrtContext.Provider>
	);
};
