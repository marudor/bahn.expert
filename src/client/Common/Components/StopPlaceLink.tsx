import { StopPlaceNameWithRl100 } from '@/client/Common/Components/StopPlaceNameWithRl100';
import { stopPropagation } from '@/client/Common/stopPropagation';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

interface Props {
	stopPlace: {
		name: string;
	} & Partial<Pick<MinimalStopPlace, 'evaNumber' | 'ril100'>>;
	className?: string;
}

export const StopPlaceLink: FC<Props> = ({ className, stopPlace, ...rest }) => {
	return (
		<Link
			data-testid="stationLink"
			className={className}
			onClick={stopPropagation}
			to="/$stopPlace"
			params={{
				stopPlace: encodeURIComponent(stopPlace.name),
			}}
			title={`Zugabfahrten für ${stopPlace.name}`}
			{...rest}
		>
			{stopPlace.evaNumber ? (
				<StopPlaceNameWithRl100 stopPlace={stopPlace as MinimalStopPlace} />
			) : (
				stopPlace.name
			)}
		</Link>
	);
};
