import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { useCallback } from 'react';

export const useFormatStopPlaceName: () => (
	stopPlace: MinimalStopPlace,
) => string = () => {
	const { showRl100 } = useCommonConfig();

	return useCallback(
		(stopPlace: MinimalStopPlace) => {
			let r = stopPlace.name;
			if (showRl100 && stopPlace?.ril100) {
				r += ` [${stopPlace.ril100}]`;
			}
			return r;
		},
		[showRl100],
	);
};
