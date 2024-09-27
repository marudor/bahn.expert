import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import {
	useCurrentAbfahrtenStopPlace,
	useRefreshCurrent,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { BaseHeader } from '@/client/Common/Components/BaseHeader';
import { StopPlaceSearch } from '@/client/Common/Components/StopPlaceSearch';
import { useQuery } from '@/client/Common/hooks/useQuery';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { ExtraMenu } from './ExtraMenu';

interface Props {
	regional?: boolean;
}

export const Header: FC<Props> = ({ regional = false }: Props) => {
	const noHeader = useQuery().noHeader;
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const refreshCurrentAbfahrten = useRefreshCurrent(true);
	const urlPrefix = useAbfahrtenUrlPrefix();
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
			navigate(`${urlPrefix}${encodeURIComponent(stopPlace.name)}`);
		},
		[urlPrefix, navigate],
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
