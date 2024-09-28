import { parse } from '@/devalue';

async function run() {
	let data = '';
	for await (const chunk of process.stdin) data += chunk;

	const json = JSON.parse(data);
	const devalued = parse(json.result.data);
	// biome-ignore lint/suspicious/noConsoleLog: script
	console.log(JSON.stringify(devalued, undefined, 2));
}
run();
