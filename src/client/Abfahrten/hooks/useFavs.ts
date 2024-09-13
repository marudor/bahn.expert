import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { useCallback } from 'react';

export type Favs = Record<string, MinimalStopPlace>;
export const useFavs = (key?: 'favs' | 'regionalFavs') => {
	const [cookies] = useExpertCookies([key!]);
	if (!key) {
		return {};
	}
	const savedFavs = cookies[key];

	return savedFavs || {};
};

export const useFavAction = (key: 'favs' | 'regionalFavs') => {
	const [_, setCookie] = useExpertCookies([key]);
	const favs = useFavs(key);

	return useCallback(
		(stopPlace: MinimalStopPlace) => {
			const newFavs = {
				...favs,
				[stopPlace.evaNumber]: {
					name: stopPlace.name,
					evaNumber: stopPlace.evaNumber,
				},
			};
			setCookie(key, newFavs);
			return newFavs;
		},
		[setCookie, favs, key],
	);
};

export const useUnfavAction = (key?: 'favs' | 'regionalFavs') => {
	const [_, setCookie] = useExpertCookies([key!]);
	const favs = useFavs(key);

	return useCallback(
		(stopPlace: MinimalStopPlace) => {
			if (!key) {
				return undefined;
			}

			delete favs[stopPlace.evaNumber];
			const newFavs = { ...favs };
			setCookie(key, newFavs);
			return newFavs;
		},
		[key, favs, setCookie],
	);
};
