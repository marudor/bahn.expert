import type { AbfahrtenError } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import {
	useFavs,
	useMostUsedComponent,
} from '@/client/Abfahrten/provider/FavProvider';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { Stack } from '@mui/material';
import { useEffect, useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router';
import type { StaticRouterContext } from 'react-router';
import { FavEntry, FavEntryDisplay } from './FavEntry';
import { MostUsed } from './MostUsed';

function getErrorText(
	error: AbfahrtenError,
	staticContext?: StaticRouterContext,
): React.ReactNode {
	switch (error.errorType) {
		case 'redirect': {
			return <Navigate to={error.redirect} />;
		}
		case '404': {
			if (staticContext) {
				staticContext.status = 404;
			}

			return 'Die Abfahrt existiert nicht';
		}
		default: {
			if (error.code === 'ECONNABORTED') {
				return 'Timeout - bitte erneut versuchen';
			}

			return 'Unbekannter Fehler';
		}
	}
}

interface Props {
	children?: ReactNode;
}

export const FavList: FC<Props> = ({ children }) => {
	const favs = useFavs();
	const MostUsedComponent = useMostUsedComponent();
	const sortedFavs = useMemo(() => {
		const values: MinimalStopPlace[] = Object.values(favs);

		return values
			.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
			.map((fav) => <FavEntry key={fav.evaNumber} fav={fav} />);
	}, [favs]);
	const { updateTitle, updateDescription, updateKeywords } =
		useHeaderTagsActions();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		updateTitle();
		updateDescription();
		updateKeywords();
	}, []);

	return (
		<Stack flex="1">
			{children}
			<Zugsuche />

			{sortedFavs.length ? (
				<>
					<FavEntryDisplay nonClickable text="Favoriten" />
					{sortedFavs}
				</>
			) : (
				<>
					<FavEntryDisplay
						nonClickable
						data-testid="noFav"
						text="Keine Favoriten"
					/>
				</>
			)}
			{MostUsedComponent && (
				<>
					<FavEntryDisplay nonClickable text="Oft Gesucht" />
					<MostUsed />
				</>
			)}
		</Stack>
	);
};
