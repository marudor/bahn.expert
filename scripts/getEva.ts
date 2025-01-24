import { scriptsTrpc } from './scriptsTrpc';

const [, , ...input] = process.argv;

async function run() {
	const evaRegex = /\d{6,8}/;
	const searchTerm = input.join(' ');
	let name = '';
	let eva = '';
	let rl100: string | undefined = '';
	if (searchTerm.match(evaRegex)) {
		const result = await scriptsTrpc.stopPlace.byKey.query(searchTerm);
		if (result) {
			name = result.name;
			eva = result.evaNumber;
			rl100 = result.ril100;
		}
	} else {
		const result = await scriptsTrpc.stopPlace.byName.query({
			searchTerm,
			max: 1,
		});
		if (result.length) {
			name = result[0].name;
			eva = result[0].evaNumber;
			rl100 = result[0].ril100;
		}
	}
	if (!name) {
		return;
	}
	if (rl100) {
		name = `${name} / ${rl100}`;
	}
	// biome-ignore lint/suspicious/noConsoleLog: script
	console.log(name);
	// biome-ignore lint/suspicious/noConsoleLog: script
	console.log(eva);
}

run();
