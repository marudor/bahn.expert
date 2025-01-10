import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { trpc } from '@/client/RPC';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { Link } from '@tanstack/react-router';
import type { FC, ReactNode } from 'react';

export const StopPlaceNameWithRl100: FC<{
	stopPlace: MinimalStopPlace;
	withAbfahrtenLink?: boolean;
	className?: string;
}> = ({ stopPlace, withAbfahrtenLink, className }) => {
	const { showRl100 } = useCommonConfig();
	const { data: fetchedStopPlace } = trpc.stopPlace.byKey.useQuery(
		stopPlace.evaNumber,
		{
			enabled: !stopPlace.ril100 && showRl100,
		},
	);
	const rl100 = stopPlace.ril100 || fetchedStopPlace?.ril100;

	let name: ReactNode;
	if (!showRl100 || !rl100) {
		name = stopPlace.name;
	} else {
		name = (
			<>
				{stopPlace.name} [{rl100}]
			</>
		);
	}

	if (withAbfahrtenLink) {
		return (
			<Link
				className={className}
				to="/$stopPlace"
				params={{
					stopPlace: encodeURIComponent(stopPlace.name),
				}}
			>
				{name}
			</Link>
		);
	}
	return name;
};
