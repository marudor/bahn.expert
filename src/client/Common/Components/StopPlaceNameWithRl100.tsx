import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { trpc } from '@/client/RPC';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { FC } from 'react';

export const StopPlaceNameWithRl100: FC<{
	stopPlace: MinimalStopPlace;
}> = ({ stopPlace }) => {
	const { showRl100 } = useCommonConfig();
	const { data: fetchedStopPlace } = trpc.stopPlace.byKey.useQuery(
		stopPlace.evaNumber,
		{
			enabled: !stopPlace.ril100 && showRl100,
		},
	);
	const rl100 = stopPlace.ril100 || fetchedStopPlace?.ril100;

	if (!showRl100 || !rl100) {
		return <>{stopPlace.name}</>;
	}
	return (
		<>
			{stopPlace.name} [{rl100}]
		</>
	);
};
