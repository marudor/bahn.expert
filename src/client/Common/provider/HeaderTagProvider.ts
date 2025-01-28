import constate from '@/constate';
import { useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

const defaultDescription =
	'Dein Begleiter um Stressfrei Bahn zu fahren. Sucht die besten Informationen aus allen Quellen um dich ans Ziel zu bringen.';
const defaultTitle = 'Bahn Experte';
const defaultKeywords = new Set([
	'marudor',
	'Bahn',
	'Experte',
	'Zugabfahrten',
	'Abfahrtstafel',
	'BahnhofsAbfahrten',
	'Zugabfahrtszeiten',
	'Verspätung',
	'Wagenreihung',
	'ICE',
	'Fernverkehr',
	'Regionalverkehr',
]);

function useHeaderTagInner() {
	const routerTitle = useRouterState({
		select: (s) =>
			s.matches
				// @ts-expect-error meta is not typed
				.map((m) => m.loaderData?.meta?.title)
				.filter(Boolean)
				.at(-1),
	});
	const [title, setTitle] = useState(routerTitle);
	useEffect(() => {
		setTitle(routerTitle || defaultTitle);
	}, [routerTitle]);
	const routerDescription = useRouterState({
		select: (s) =>
			s.matches
				// @ts-expect-error meta is not typed
				.map((m) => m.loaderData?.meta?.description)
				.filter(Boolean)
				.at(-1),
	});
	const [description, setDescription] = useState(defaultDescription);
	useEffect(() => {
		setDescription(routerDescription || defaultDescription);
	}, [routerDescription]);
	const [keywords, setKeywords] = useState(defaultKeywords);

	const updateTitle = useCallback((newTitle: string = defaultTitle) => {
		setTitle(newTitle);
	}, []);
	const updateDescription = useCallback(
		(newDescription: string = defaultDescription) => {
			setDescription(newDescription);
		},
		[],
	);
	const updateKeywords = useCallback((addedKeywords?: string[]) => {
		if (addedKeywords) {
			setKeywords(new Set([...addedKeywords, ...defaultKeywords]));
		} else {
			setKeywords(defaultKeywords);
		}
	}, []);

	return {
		values: {
			title,
			description,
			keywords,
		},
		actions: {
			updateTitle,
			updateDescription,
			updateKeywords,
		},
	};
}

export const [HeaderTagProvider, useHeaderTags, useHeaderTagsActions] =
	constate(
		useHeaderTagInner,
		(v) => v.values,
		(v) => v.actions,
	);
