import type { MinimalStopPlace } from '@/types/stopPlace';
import type { ServerStorage } from '@/client/Common/Storage';

export function sanitizeStorage(storage: ServerStorage): void {
  sanitizeFavs(storage, 'favs');
  sanitizeFavs(storage, 'regionalFavs');
  sanitizeRoutingFavs(storage, 'rfavs');
}

function sanitizeFavs(
  storage: ServerStorage,
  storageKey: 'favs' | 'regionalFavs',
) {
  const favs = storage.get(storageKey);
  if (!favs) {
    return;
  }
  if (typeof favs !== 'object') {
    storage.remove(storageKey);
    return;
  }
  let modified = false;
  for (const favKey of Object.keys(favs)) {
    if (!isCurrentFormatFav(favs[favKey])) {
      delete favs[favKey];
      modified = true;
    }
  }
  if (modified) storage.set(storageKey, favs);
}

function isCurrentFormatFav(stop?: MinimalStopPlace): boolean {
  return Boolean(stop?.evaNumber && stop.name);
}

export function sanitizeRoutingFavs(
  storage: ServerStorage,
  storageKey: 'rfavs',
): void {
  const favs = storage.get(storageKey);
  if (!favs) {
    return;
  }
  if (typeof favs !== 'object') {
    storage.remove(storageKey);
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
  if (modified) storage.set(storageKey, favs);
}
