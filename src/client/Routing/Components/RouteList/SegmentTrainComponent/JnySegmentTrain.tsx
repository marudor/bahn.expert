import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { CoachSequence } from '@/client/Common/Components/CoachSequence/CoachSequence';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { StopList } from '@/client/Routing/Components/RouteList/StopList';
import type { RouteJourneySegmentTrain } from '@/types/routing';
import { Tooltip } from '@mui/material';
import type { FC, HTMLProps, MouseEvent } from 'react';
import { segmentStyles } from './style';

interface Props extends HTMLProps<HTMLDivElement> {
	segment: RouteJourneySegmentTrain;
	detail?: boolean;
	onTrainClick?: (e: MouseEvent) => void;
}
export const JnySegmentTrain: FC<Props> = ({
	segment,
	onTrainClick,
	detail,
	...rest
}) => {
	const tooltipTitle =
		segment.train.number &&
		segment.train.line &&
		(segment.train.name.endsWith(segment.train.number)
			? `Linie ${segment.train.line}`
			: `Nummer ${segment.train.number}`);

	return (
		<div onClick={onTrainClick} {...rest}>
			<div css={segmentStyles.info}>
				<span css={segmentStyles.margin}>
					<span>
						<Tooltip title={tooltipTitle ?? segment.train.name}>
							<DetailsLink
								train={segment.train}
								evaNumberAlongRoute={segment.segmentStart.evaNumber}
								initialDeparture={segment.departure.scheduledTime}
								jid={segment.jid}
							>
								{segment.train.name}
							</DetailsLink>
						</Tooltip>
					</span>
				</span>
				<span css={[segmentStyles.margin, segmentStyles.destination]}>
					{segment.finalDestination}
				</span>
				{segment.auslastung && (
					<AuslastungsDisplay
						auslastung={{
							occupancy: segment.auslastung,
						}}
					/>
				)}
			</div>
			{detail && (
				<>
					{segment.train.number && segment.train.type && (
						<CoachSequence
							css={segmentStyles.sequence}
							trainNumber={segment.train.number}
							trainCategory={segment.train.type}
							currentEvaNumber={segment.segmentStart.evaNumber}
							scheduledDeparture={segment.departure.scheduledTime}
							initialDeparture={
								(segment.stops[0].departure || segment.stops[0].arrival)
									?.scheduledTime
							}
							administration={segment.train.admin}
							loadHidden
						/>
					)}
					<StopList stops={segment.stops} />
				</>
			)}
		</div>
	);
};
