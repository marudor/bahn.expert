import { ReferenceSummary } from '@/client/Common/Components/Details/ReferenceSummary';
import { Stop } from '@/client/Common/Components/Details/Stop';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import type { RouteStop } from '@/types/routing';
import { Error } from '@mui/icons-material';
import { Stack, css, styled } from '@mui/material';
import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';
import { Loading } from '../Loading';

const SummaryContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	margin: '0.65em',
	padding: '0.65em',
	border: `1px ${theme.vars.palette.text.primary} solid`,
}));

function getErrorText(error: AxiosError) {
	if (error.code === 'ECONNABORTED') return 'Timeout, bitte neuladen.';
	if (error.response?.status === 404) {
		return 'Unbekannter Zug';
	}

	return 'Unbekannter Fehler';
}

const ErrorStyle = css`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  text-align: center;
`;

const ErrorIcon = styled(Error)(ErrorStyle);

export const StopList: FC = () => {
	const { details, error, initialDepartureDate } = useDetails();
	const [currentSequenceStop, setCurrentSequenceStop] = useState(
		details?.currentStop?.station.evaNumber,
	);

	const onStopClick = useCallback((stop: RouteStop) => {
		setCurrentSequenceStop(stop.station.evaNumber);
	}, []);

	useEffect(() => {
		if (details?.currentStop) {
			setCurrentSequenceStop(details.currentStop.station.evaNumber);
			const scrollDom = document.getElementById(
				details.currentStop.station.evaNumber,
			);

			if (scrollDom) {
				scrollDom.scrollIntoView();
			}
		}
	}, [details]);

	const detailsStops = useMemo(() => {
		if (!details) return null;
		let hadCurrent = false;

		return details.stops.map((s, i) => {
			if (
				details.currentStop?.station.evaNumber === s.station.evaNumber ||
				!details.currentStop
			) {
				hadCurrent = true;
			}

			return (
				<Stop
					onStopClick={onStopClick}
					isPast={!hadCurrent}
					continuationFor={i === 0 ? details.continuationFor : undefined}
					continuationBy={
						i === details.stops.length - 1 ? details.continuationBy : undefined
					}
					train={details.train}
					stop={s}
					key={s.station.evaNumber}
					showWR={
						currentSequenceStop === s.station.evaNumber
							? details.train
							: undefined
					}
					lastArrivalEva={details.segmentDestination.evaNumber}
					initialDepartureDate={initialDepartureDate}
				/>
			);
		});
	}, [details, currentSequenceStop, onStopClick, initialDepartureDate]);

	if (error) {
		return (
			<Stack css={ErrorStyle}>
				<ErrorIcon data-testid="error" /> {getErrorText(error)}
			</Stack>
		);
	}

	if (!details) {
		return <Loading />;
	}

	return (
		<Stack>
			<ReferenceSummary stops={details.stops} />
			{detailsStops}
		</Stack>
	);
};
