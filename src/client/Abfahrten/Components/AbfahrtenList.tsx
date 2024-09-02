import {
	useAbfahrtenError,
	useCurrentAbfahrtenStopPlace,
	useRawAbfahrten,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
import {
	useAbfahrten,
	useRefreshCurrent,
} from '@/client/Abfahrten/provider/AbfahrtenProvider/hooks';
import {
	SelectedDetailProvider,
	useSelectedDetail,
} from '@/client/Abfahrten/provider/SelectedDetailProvider';
import { Loading } from '@/client/Common/Components/Loading';
import { Streik } from '@/client/Common/Components/Streik';
import { Error } from '@/client/Common/Error';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import type { AbfahrtenResult } from '@/types/iris';
import { Stack, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router';
import { Abfahrt } from './Abfahrt';

const LookaheadMarker = styled('div')`
  height: 154px;
  position: absolute;
  bottom: 0;
`;

const Lookbehind = styled('div')(({ theme }) => ({
	position: 'relative',
	paddingTop: 10,
	backgroundColor: theme.vars.palette.common.shadedBackground,
}));

const InnerAbfahrtenList = () => {
	const { updateCurrentStopPlaceByString, setCurrentStopPlace } =
		useRawAbfahrten();
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const selectedDetail = useSelectedDetail();
	const [scrolled, setScrolled] = useState(false);
	const { filteredAbfahrten, unfilteredAbfahrten } = useAbfahrten();
	const paramStation = useParams().station;
	const { autoUpdate } = useCommonConfig();
	const refreshCurrentAbfahrten = useRefreshCurrent();
	const { updateTitle, updateDescription, updateKeywords } =
		useHeaderTagsActions();
	const abfahrtenError = useAbfahrtenError();

	useEffect(() => {
		if (currentStopPlace) {
			updateTitle(currentStopPlace.name);
			updateDescription(`Zugabfahrten für ${currentStopPlace.name}`);
			updateKeywords([currentStopPlace.name]);
		} else {
			updateTitle();
			updateDescription();
			updateKeywords();
		}
	}, [currentStopPlace, updateDescription, updateTitle, updateKeywords]);

	useEffect(() => {
		return () => {
			setCurrentStopPlace(undefined);
		};
	}, [setCurrentStopPlace]);

	useEffect(() => {
		if (unfilteredAbfahrten) {
			setScrolled(false);
		}
	}, [unfilteredAbfahrten]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		const cleanup = () => {
			clearInterval(intervalId);
		};

		if (autoUpdate) {
			intervalId = setInterval(() => {
				void refreshCurrentAbfahrten();
			}, autoUpdate * 1000);
		} else {
			cleanup();
		}

		return cleanup;
	}, [autoUpdate, refreshCurrentAbfahrten]);

	const [oldMatch, setOldMatch] = useState(paramStation);

	useEffect(() => {
		if (!currentStopPlace || oldMatch !== paramStation) {
			setOldMatch(paramStation);
			void updateCurrentStopPlaceByString(
				decodeURIComponent(paramStation || ''),
			);
		}
	}, [
		currentStopPlace,
		oldMatch,
		paramStation,
		updateCurrentStopPlaceByString,
	]);

	useEffect(() => {
		if (scrolled) {
			return;
		}
		if (unfilteredAbfahrten) {
			let scrollDom: HTMLElement | null = null;

			if (selectedDetail) {
				scrollDom = document.getElementById(selectedDetail);
			}
			if (!scrollDom && unfilteredAbfahrten.lookbehind.length > 0) {
				scrollDom = document.querySelector('#lookaheadMarker');
			}
			if (scrollDom) {
				const scrollIntoView = () =>
					setTimeout(() => scrollDom?.scrollIntoView());

				if (document.readyState === 'complete') {
					scrollIntoView();
				} else {
					window.addEventListener('load', scrollIntoView);
				}
			}
			setScrolled(true);
		}
	}, [unfilteredAbfahrten, scrolled, selectedDetail]);

	if (abfahrtenError) {
		return <Error error={abfahrtenError} context="Halt" />;
	}

	return (
		<Loading check={unfilteredAbfahrten}>
			{() => (
				<Stack component="main">
					{filteredAbfahrten &&
					(filteredAbfahrten.departures.length > 0 ||
						filteredAbfahrten.lookbehind.length > 0) ? (
						<>
							{Boolean(
								unfilteredAbfahrten?.strike && unfilteredAbfahrten.strike > 10,
							) && <Streik />}
							{filteredAbfahrten.lookbehind.length > 0 && (
								<Lookbehind id="lookbehind" data-testid="lookbehind">
									{filteredAbfahrten.lookbehind.map((a) => (
										<Abfahrt abfahrt={a} key={a.rawId} />
									))}
									<LookaheadMarker id="lookaheadMarker" />
								</Lookbehind>
							)}
							<div id="lookahead" data-testid="lookahead">
								{filteredAbfahrten.departures.map((a) => (
									<Abfahrt abfahrt={a} key={a.rawId} />
								))}
							</div>
						</>
					) : (
						<NothingFound unfilteredAbfahrten={unfilteredAbfahrten} />
					)}
				</Stack>
			)}
		</Loading>
	);
};

const NothingFound: FC<{
	unfilteredAbfahrten?: AbfahrtenResult;
}> = ({ unfilteredAbfahrten }) => {
	let text = 'Leider keine Abfahrten in nächster Zeit';
	if (unfilteredAbfahrten) {
		const hasUnfiltered =
			unfilteredAbfahrten.departures.length > 0 ||
			unfilteredAbfahrten.lookbehind.length > 0;
		if (hasUnfiltered) {
			text =
				'Es gibt Abfahrten, diese werden aber durch den gesetzten Filter nicht angezeigt.';
		}
	}
	return <div>{text}</div>;
};

export const AbfahrtenList: FC = () => (
	<SelectedDetailProvider>
		<InnerAbfahrtenList />
	</SelectedDetailProvider>
);
