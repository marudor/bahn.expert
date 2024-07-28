import { Cache, CacheDatabase } from '@/server/cache';

const cachesThatMightBeBroken = [
	CacheDatabase.StopPlaceSearch,
	CacheDatabase.StopPlaceSalesSearch,
	CacheDatabase.StopPlaceByEva,
	CacheDatabase.StopPlaceByRil,
].map((cacheNumber) => {
	return new Cache(cacheNumber);
});

async function doStuff() {
	for (const c of cachesThatMightBeBroken) {
		const allEntries = await c.getAll();
		for (const [key, value] of allEntries) {
			if (!value || (Array.isArray(value) && !value.length)) {
				console.log(`key: ${key} isEmpty, removing`);
				await c.delete(key);
			}
		}
	}
}

void doStuff().then(() => {
	process.exit(0);
});
