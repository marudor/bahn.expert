import { useAbfahrtenFilterOpen } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCurrentAbfahrtenStopPlace } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import {
	useFavActions,
	useFavs,
} from '@/client/Abfahrten/provider/FavProvider';
import { trpc } from '@/client/RPC';
import {
	Favorite,
	FavoriteBorder,
	FilterList,
	Layers,
	LayersClear,
	Tune,
} from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import { FilterModal } from './FilterModal';

export const ExtraMenu: FC = () => {
	const setFilterOpen = useAbfahrtenFilterOpen();
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const { data: lageplan } = trpc.stopPlace.lageplan.useQuery(
		{
			evaNumber: currentStopPlace?.evaNumber!,
			stopPlaceName: currentStopPlace?.name!,
		},
		{
			enabled: Boolean(currentStopPlace),
			staleTime: Number.POSITIVE_INFINITY,
		},
	);
	const favs = useFavs();
	const { fav, unfav } = useFavActions();
	const isFaved = Boolean(currentStopPlace && favs[currentStopPlace.evaNumber]);
	const [anchor, setAnchor] = useState<undefined | HTMLElement>();
	const toggleFav = useCallback(() => {
		setAnchor(undefined);
		if (currentStopPlace) {
			if (isFaved) {
				unfav(currentStopPlace);
			} else {
				fav(currentStopPlace);
			}
		}
	}, [currentStopPlace, fav, isFaved, unfav]);
	const toggleMenu = useCallback(
		(e: SyntheticEvent<HTMLElement>) => {
			setAnchor(anchor ? undefined : e.currentTarget);
		},
		[anchor],
	);
	const openLageplan = useCallback(() => {
		setAnchor(undefined);
		if (lageplan) {
			window.open(lageplan, '_blank');
		}
	}, [lageplan]);
	const openFilterCb = useCallback(() => {
		setFilterOpen(true);
		setAnchor(undefined);
	}, [setFilterOpen]);

	return (
		<>
			<FilterModal />
			<IconButton
				data-testid="menu"
				aria-label="Tune"
				onClick={toggleMenu}
				color="inherit"
			>
				<Tune />
			</IconButton>
			<Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
				{currentStopPlace && [
					<MenuItem data-testid="toggleFav" key="1" onClick={toggleFav}>
						{isFaved ? (
							<>
								<Favorite /> Unfav
							</>
						) : (
							<>
								<FavoriteBorder /> Fav
							</>
						)}
					</MenuItem>,
					<MenuItem data-testid="lageplan" key="2" onClick={openLageplan}>
						{lageplan ? <Layers /> : <LayersClear />} Lageplan
					</MenuItem>,
				]}
				<MenuItem data-testid="openFilter" onClick={openFilterCb}>
					<FilterList /> Filter
				</MenuItem>
			</Menu>
		</>
	);
};
