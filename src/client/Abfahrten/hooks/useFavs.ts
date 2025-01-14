import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { useCallback } from 'react';

export type Favs = Record<string, MinimalStopPlace>;
export const useFavs = () => {
	const [cookies] = useExpertCookies(['favs']);
	const savedFavs = cookies.favs;

	return savedFavs || {};
};

export const useFavAction = () => {
	const [_, setCookie] = useExpertCookies(['favs']);
	const favs = useFavs();

	return useCallback(
		(stopPlace: MinimalStopPlace) => {
			const newFavs = {
				...favs,
				[stopPlace.evaNumber]: {
					name: stopPlace.name,
					evaNumber: stopPlace.evaNumber,
				},
			};
			setCookie('favs', newFavs);
			return newFavs;
		},
		[setCookie, favs],
	);
};

export const useUnfavAction = () => {
	const [_, setCookie] = useExpertCookies(['favs']);
	const favs = useFavs();

	return useCallback(
		(stopPlace: MinimalStopPlace) => {
			delete favs[stopPlace.evaNumber];
			const newFavs = { ...favs };
			setCookie('favs', newFavs);
			return newFavs;
		},
		[favs, setCookie],
	);
};
