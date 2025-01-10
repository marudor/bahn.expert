import {
	useCurrentAbfahrtenStopPlace,
	useRefreshCurrent,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { StopPlaceSearch } from '@/client/Common/Components/StopPlaceSearch';
import type { MinimalStopPlace } from '@/types/stopPlace';
import Refresh from '@mui/icons-material/Refresh';
import { IconButton } from '@mui/material';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { ExtraMenu } from './ExtraMenu';

interface Props {
	regional?: boolean;
}

export const Header: FC<Props> = ({ regional = false }: Props) => {
	const { noHeader } = useSearch({ strict: false });
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const refreshCurrentAbfahrten = useRefreshCurrent(true);
	const navigate = useNavigate();
	const [currentEnteredStopPlace, setCurrentEnteredStopPlace] = useState<
		MinimalStopPlace | undefined
	>(currentStopPlace);

	useEffect(() => {
		setCurrentEnteredStopPlace(currentStopPlace);
	}, [currentStopPlace]);
	const submit = useCallback(
		(stopPlace: MinimalStopPlace | undefined) => {
			setCurrentEnteredStopPlace(stopPlace);
			if (!stopPlace) {
				return;
			}
			navigate({
				to: '/$stopPlace',
				params: {
					stopPlace: encodeURIComponent(stopPlace.name),
				},
			});
		},
		[navigate],
	);

	if (noHeader) {
		return null;
	}

	return (
		<BaseHeader>
			<StopPlaceSearch
				id="abfahrtenHeaderSearch"
				autoFocus={!currentStopPlace}
				filterForIris={!regional}
				groupedBySales={regional}
				value={currentEnteredStopPlace}
				onChange={submit}
				placeholder={`Bahnhof (z.B. ${
					currentStopPlace ? currentStopPlace.name : 'Kiel Hbf'
				})`}
			/>
			{Boolean(currentStopPlace) && (
				<IconButton
					onClick={refreshCurrentAbfahrten}
					aria-label="refresh"
					color="inherit"
					edge="end"
				>
					<Refresh />
				</IconButton>
			)}
			<ExtraMenu favKey={regional ? 'regionalFavs' : 'favs'} />
		</BaseHeader>
	);
};
