import { exec } from 'node:child_process';
import { Cache, CacheDatabase } from '@/server/cache';

const relevantCaches = [
	// CacheDatabase.StopPlaceByEva,
	// CacheDatabase.StopPlaceIdentifier,
	// CacheDatabase.IrisTTSStation,
	// CacheDatabase.StopPlaceByRil,
	CacheDatabase.JourneysForVehicle,
];

async function doStuff() {
	const cp = exec(
		'kubectl port-forward service/redis 6380:6379 -n marudor --context marudor',
	);
	await new Promise((resolve) => setTimeout(resolve, 2500));

	for (const relevantCache of relevantCaches) {
		const localCache = new Cache(relevantCache);
		const remoteCache = new Cache(relevantCache, {
			host: 'localhost',
			port: 6380,
		});

		const allEntries = await remoteCache.getAll();
		// biome-ignore lint/suspicious/noConsoleLog: script
		console.log(
			`migrating ${allEntries.length} entries for cache ${relevantCache}`,
		);
		for (const [key, value] of allEntries) {
			await localCache.set(key, value);
		}
	}

	cp.kill(9);
	await new Promise((resolve) => setTimeout(resolve, 2500));
	process.exit(0);
}
doStuff();
