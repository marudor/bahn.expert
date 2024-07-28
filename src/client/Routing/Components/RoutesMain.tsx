import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import { useRoutingConfig } from '@/client/Routing/provider/RoutingConfigProvider';
import { format } from 'date-fns';
import { useEffect } from 'react';
import type { FC } from 'react';
import { RouteList } from './RouteList';
import { Search } from './Search';

const RouteHeaderTags = () => {
	const { updateTitle, updateDescription, updateKeywords } =
		useHeaderTagsActions();
	const { start, destination, via, date } = useRoutingConfig();

	useEffect(() => {
		if (!start && !destination) {
			updateTitle();
			updateDescription();
			updateKeywords();
		} else {
			updateTitle(
				`${start?.name ?? '?'} -> ${destination?.name ?? '?'} @ ${format(
					date || Date.now(),
					'HH:mm dd.MM.yy',
				)}`,
			);
			const viaString = `-> ${via.map((v) => `${v.name} -> `)}`;

			updateDescription(
				`${start?.name ?? '?'} ${viaString}${
					destination?.name ?? '?'
				} @ ${format(date || Date.now(), 'HH:mm dd.MM.yy')}`,
			);
		}
	}, [
		start,
		destination,
		via,
		date,
		updateDescription,
		updateTitle,
		updateKeywords,
	]);

	return null;
};

export const RoutesMain: FC = () => {
	return (
		<main>
			<RouteHeaderTags />
			<Search />
			<RouteList />
		</main>
	);
};
