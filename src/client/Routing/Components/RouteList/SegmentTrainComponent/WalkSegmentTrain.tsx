import { stopPropagation } from '@/client/Common/stopPropagation';
import type { RouteJourneySegmentWalk } from '@/types/routing';
import type { FC } from 'react';
import { segmentStyles } from './style';

interface Props {
	segment: RouteJourneySegmentWalk;
	className?: string;
}

export const WalkSegmentTrain: FC<Props> = ({ segment, className }) => {
	const mapsLink = `https://www.google.com/maps/dir/?api=1&origin=${segment.segmentStart.coordinates.lat},${segment.segmentStart.coordinates.lng}&destination=${segment.segmentDestination.coordinates.lat},${segment.segmentDestination.coordinates.lng}&travelmode=walking`;

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
