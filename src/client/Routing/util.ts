import type { MinimalStopPlace } from '@/types/stopPlace';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

export function formatDuration(duration: number): string {
	const durInMinutes = duration / 1000 / 60;
	const hours = Math.floor(durInMinutes / 60);
	const minutes = Math.floor(durInMinutes % 60);

	return `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}`;
}

export function getRouteLink(
	start: MinimalStopPlace,
	destination: MinimalStopPlace,
	via: MinimalStopPlace[],
	date?: Date | null,
): string {
	return `/routing/${start.evaNumber}/${destination.evaNumber}/${
		date?.toISOString() || 0
	}/${via.map((v) => `${v.evaNumber}|`).join('')}`;
}

export function useRoutingNavigate() {
	const navigate = useNavigate();
	return useCallback(
		(
			start: MinimalStopPlace,
			destination: MinimalStopPlace,
			via: MinimalStopPlace[],
			date?: Date | null,
		) => {
			const baseParams = {
				start: start.evaNumber,
				destination: destination.evaNumber,
			};
			const serializedVia = via.map((v) => `${v.evaNumber}|`).join('');
			const serializedDate = date?.toISOString() || 0;
			if (serializedDate) {
				if (serializedVia) {
					return navigate({
						to: '/routing/$start/$destination/$date/$via',
						params: {
							...baseParams,
							date: serializedDate,
							via: serializedVia,
						},
					});
				}
				return navigate({
					to: '/routing/$start/$destination/$date',
					params: {
						...baseParams,
						date: serializedDate,
					},
				});
			}
			return navigate({
				to: '/routing/$start/$destination',
				params: baseParams,
			});
		},
		[navigate],
	);
}
