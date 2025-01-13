import type { ServerStorage } from '@/client/Common/Storage';
import type { MinimalStopPlace } from '@/types/stopPlace';

export function sanitizeStorage(storage: ServerStorage): void {
	sanitizeFavs(storage);
	sanitizeRoutingFavs(storage);
}

function sanitizeFavs(storage: ServerStorage) {
	const favs = storage.get('favs');
	if (!favs) {
		return;
	}
	if (typeof favs !== 'object') {
		storage.remove('favs');
		return;
	}
	let modified = false;
	for (const favKey of Object.keys(favs)) {
		if (!isCurrentFormatFav(favs[favKey])) {
			delete favs[favKey];
			modified = true;
		}
	}
	if (modified) storage.set('favs', favs);
}

function isCurrentFormatFav(stop?: MinimalStopPlace): boolean {
	return Boolean(stop?.evaNumber && stop.name);
}

export function sanitizeRoutingFavs(storage: ServerStorage): void {
	const favs = storage.get('rfavs');
	if (!favs) {
		return;
	}
	if (typeof favs !== 'object') {
		storage.remove('rfavs');
		return;
	}
	let modified = false;
	for (const favKey of Object.keys(favs)) {
		const fav = favs[favKey];

		if (
			!isCurrentFormatFav(fav.destination) ||
			!isCurrentFormatFav(fav.start) ||
			!fav.via?.every(isCurrentFormatFav)
		) {
			delete favs[favKey];
			modified = true;
		}
	}
	if (modified) storage.set('rfavs', favs);
}
