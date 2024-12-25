import { trpc } from '@/client/RPC';
import type { MinimalStopPlace } from '@/types/stopPlace';
import debounce from 'debounce-promise';
import type { ControllerStateAndHelpers } from 'downshift';
import { useCallback, useMemo, useRef, useState } from 'react';

interface UseStationSearchOptions {
	maxSuggestions: number;
	filterForIris?: boolean;
	groupedBySales?: boolean;
}

const itemToString = (s: MinimalStopPlace | null) => (s ? s.name : '');

export const useStopPlaceSearch = ({
	filterForIris,
	maxSuggestions,
}: UseStationSearchOptions) => {
	const [suggestions, setSuggestions] = useState<MinimalStopPlace[]>([]);
	const [loading, setLoading] = useState(false);
	const trpcUtils = trpc.useUtils();

	const stopPlaceFn = useMemo(
		() =>
			debounce(
				(searchTerm: string) =>
					trpcUtils.stopPlace.byName.fetch({
						searchTerm,
						filterForIris,
						max: maxSuggestions,
					}),
				200,
			),
		[filterForIris, maxSuggestions, trpcUtils.stopPlace.byName],
	);

	const loadOptions = useCallback(
		async (value: string) => {
			setLoading(true);

			const currentSuggestions = await stopPlaceFn(value);

			setSuggestions(currentSuggestions);
			setLoading(false);
		},
		[stopPlaceFn],
	);
	const selectRef = useRef<ControllerStateAndHelpers<MinimalStopPlace>>(null);

	return {
		loadOptions,
		suggestions,
		setSuggestions,
		loading,
		itemToString,
		selectRef,
	};
};
