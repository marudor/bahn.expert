import { Routing } from '@/client/Routing';
import { createFileRoute } from '@tanstack/react-router';

// TODO: Find out how to type?
export const routingLoader = async (ctx: any) => {
	const promises = [];
	if (ctx.params.start) {
		promises.push(
			ctx.context.trpcUtils.stopPlace.byKey.fetch(ctx.params.start),
		);
	}
	if (ctx.params.destination) {
		promises.push(
			ctx.context.trpcUtils.stopPlace.byKey.fetch(ctx.params.destination),
		);
	}
	if (ctx.params.date) {
		const dateNumber = +ctx.params.date;
		if (dateNumber) {
			promises.push(
				Promise.resolve(
					new Date(Number.isNaN(dateNumber) ? ctx.params.date : dateNumber),
				),
			);
		} else {
			promises.push(Promise.resolve(undefined));
		}
	}
	if (ctx.params.via) {
		const viaStations: string[] = ctx.params.via.split('|').filter(Boolean);
		promises.push(
			Promise.all(
				viaStations.map((eva) =>
					ctx.context.trpcUtils.stopPlace.byKey.fetch(eva),
				),
			),
		);
	}
	const data = await Promise.all(promises);
	return {
		start: data[0],
		destination: data[1],
		date: data[2],
		via: data[3],
	};
};

export const Route = createFileRoute('/routing/')({
	component: Routing,
});
