import { stopPropagation } from '@/client/Common/stopPropagation';
import type { RouteJourneySegmentWalk } from '@/types/routing';
import type { FC } from 'react';
import { segmentStyles } from './style';

interface Props {
	segment: RouteJourneySegmentWalk;
	className?: string;
}

export const WalkSegmentTrain: FC<Props> = ({ segment, className }) => {
	if (!segment.segmentDestination.position || !segment.segmentStart.position) {
		return null;
	}
	const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${segment.segmentStart.position.latitude},${segment.segmentStart.position.longitude}&destination=${segment.segmentDestination.position.latitude},${segment.segmentDestination.position.longitude}&travelmode=walking`;

	return (
		<div className={className}>
			<div css={segmentStyles.info}>
				<span css={segmentStyles.margin}>{segment.train.name}</span>
				<a
					css={[segmentStyles.margin, segmentStyles.destination]}
					onClick={stopPropagation}
					href={mapsLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					Maps Routing
				</a>
			</div>
		</div>
	);
};
