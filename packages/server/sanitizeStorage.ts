import type { MinimalStopPlace } from 'types/stopPlace';
import type { ServerStorage } from 'client/Common/Storage';

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
  Object.keys(favs).forEach((favKey) => {
    // @ts-expect-error migrating old format
    if (favs[favKey].title || favs[favKey].id) {
      favs[favKey] = migrateOldFav(favs[favKey]);
    }

    if (!isCurrentFormatFav(favs[favKey])) {
      delete favs[favKey];
    }
  });
  storage.set(storageKey, favs);
}

function isCurrentFormatFav(stop: MinimalStopPlace): boolean {
  return Boolean(stop.evaNumber && stop.name);
}

function migrateOldFav(oldFav: any): MinimalStopPlace {
  return {
    name: oldFav.title,
    evaNumber: oldFav.id.length > 7 ? oldFav.id.substring(2) : oldFav.id,
  };
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
  Object.keys(favs).forEach((favKey) => {
    const fav = favs[favKey];
    // @ts-expect-error migrateOldFormat
    if (fav.start.id) {
      fav.start = migrateOldFav(fav.start);
      fav.destination = migrateOldFav(fav.destination);
      fav.via = fav.via.map(migrateOldFav);
      // @ts-expect-error old format hat profile
      delete fav.profile;
    }

    if (
      !isCurrentFormatFav(fav.destination) ||
      !isCurrentFormatFav(fav.start) ||
      !fav.via?.every(isCurrentFormatFav)
    ) {
      delete favs[favKey];
    }
  });
  storage.set(storageKey, favs);
}
