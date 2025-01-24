import { scriptsTrpc } from './scriptsTrpc';

async function fetch() {
	const mostUsedNames = [
		'Frankfurt (Main) Hbf',
		'Karlsruhe Hbf',
		'Dortmund Hbf',
		'Regensburg Hbf',
		'Köln Hbf',
		'Hamburg Hbf',
		'Berlin Hbf',
		'Hannover Hbf',
		'München Hbf',
		'Düsseldorf Hbf',
		'Stuttgart Hbf',
		'Nürnberg Hbf',
		'Mannheim Hbf',
		'Dresden Hbf',
	].map((n) => n.toLowerCase());

	const resolvedStopPlaces = (
		await Promise.all(
			mostUsedNames.map((name) =>
				scriptsTrpc.stopPlace.byName.query({
					searchTerm: name,
				}),
			),
		)
	).flatMap((s) => s[0]);

	// biome-ignore lint/suspicious/noConsoleLog: script
	console.log(
		JSON.stringify(
			resolvedStopPlaces.map((s) => ({
				evaNumber: s.evaNumber,
				name: s.name,
			})),
		),
	);
}

fetch();
