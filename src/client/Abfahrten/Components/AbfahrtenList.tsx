import {
	useAbfahrtenDepartures,
	useAbfahrtenError,
	useCurrentAbfahrtenStopPlace,
	useRawAbfahrten,
	useRefreshCurrent,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
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
import { getRouteApi } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { FC } from 'react';
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

const route = getRouteApi('/_abfahrten/$stopPlace');

const InnerAbfahrtenList = () => {
	const {
		updateCurrentStopPlaceByString,
		setCurrentStopPlace,
		scrolled,
		setScrolled,
	} = useRawAbfahrten();
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const [selectedDetail] = useSelectedDetail();
	const { filteredDepartures, departures } = useAbfahrtenDepartures();
	const { stopPlace } = route.useParams();
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

	const [oldMatch, setOldMatch] = useState(stopPlace);

	useEffect(() => {
		if (!currentStopPlace || oldMatch !== stopPlace) {
			setOldMatch(stopPlace);
			void updateCurrentStopPlaceByString(decodeURIComponent(stopPlace || ''));
		}
	}, [currentStopPlace, oldMatch, stopPlace, updateCurrentStopPlaceByString]);

	useEffect(() => {
		if (scrolled) {
			return;
		}
		if (departures) {
			let scrollDom: HTMLElement | null = null;

			if (selectedDetail) {
				scrollDom = document.getElementById(selectedDetail);
			}
			if (!scrollDom && departures.lookbehind.length > 0) {
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
	}, [departures, scrolled, selectedDetail, setScrolled]);

	if (abfahrtenError) {
		return <Error />;
	}

	return (
		<Loading check={departures}>
			{() => (
				<Stack component="main">
					{filteredDepartures &&
					(filteredDepartures.departures.length > 0 ||
						filteredDepartures.lookbehind.length > 0) ? (
						<>
							{Boolean(departures?.strike && departures.strike > 10) && (
								<Streik />
							)}
							{filteredDepartures.lookbehind.length > 0 && (
								<Lookbehind id="lookbehind" data-testid="lookbehind">
									{filteredDepartures.lookbehind.map((a) => (
										<Abfahrt abfahrt={a} key={a.rawId} />
									))}
									<LookaheadMarker id="lookaheadMarker" />
								</Lookbehind>
							)}
							<div id="lookahead" data-testid="lookahead">
								{filteredDepartures.departures.map((a) => (
									<Abfahrt abfahrt={a} key={a.rawId} />
								))}
							</div>
						</>
					) : (
						<NothingFound unfilteredAbfahrten={departures} />
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
