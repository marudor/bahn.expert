import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import constate from '@/constate';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

export interface RoutingFav {
	start: MinimalStopPlace;
	destination: MinimalStopPlace;
	via: MinimalStopPlace[];
}
export type RoutingFavs = Record<string, RoutingFav>;

export function routingFavKey(fav: RoutingFav): string {
	return `${fav.start.evaNumber}${fav.via.map((s) => s.evaNumber)}${
		fav.destination.evaNumber
	}`;
}

interface InitialRoutingFavStorageProps {
	initialFavs?: RoutingFavs;
}

function useRoutingFavStorage({
	initialFavs,
}: PropsWithChildren<InitialRoutingFavStorageProps>) {
	const [favs, setFavs] = useState<RoutingFavs>(initialFavs || {});
	const [_, setRoutingFav] = useExpertCookies(['rfavs']);
	const updateFavs = useCallback(
		(updateFn: (oldFavs: RoutingFavs) => RoutingFavs) => {
			setFavs((oldFavs) => {
				const newFavs = updateFn(oldFavs);
				setRoutingFav('rfavs', newFavs);
				return newFavs;
			});
		},
		[setRoutingFav],
	);

	const unfav = useCallback(
		(fav: RoutingFav) => {
			updateFavs((oldFavs) => {
				const relevantFav = Object.entries(oldFavs).find(([_, favEntry]) => {
					return favEntry === fav;
				});
				if (relevantFav) {
					delete oldFavs[relevantFav[0]];
				}
				return { ...oldFavs };
			});
		},
		[updateFavs],
	);

	const favorite = useCallback(
		(fav: RoutingFav) => {
			updateFavs((oldFavs) => ({
				...oldFavs,
				[routingFavKey(fav)]: fav,
			}));
		},
		[updateFavs],
	);

	return {
		favs,
		fav: favorite,
		unfav,
	};
}

export const [InnerRoutingFavProvider, useRoutingFavs, useRoutingFavActions] =
	constate(
		useRoutingFavStorage,
		(v) => v.favs,
		(v) => ({
			fav: v.fav,
			unfav: v.unfav,
		}),
	);

export const RoutingFavProvider: FC<PropsWithChildren<unknown>> = ({
	children,
}) => {
	const [cookies] = useExpertCookies(['rfavs']);

	return (
		<InnerRoutingFavProvider initialFavs={cookies.rfavs}>
			{children}
		</InnerRoutingFavProvider>
	);
};
