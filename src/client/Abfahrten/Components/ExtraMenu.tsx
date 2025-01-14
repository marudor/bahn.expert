import {
	useFavAction,
	useFavs,
	useUnfavAction,
} from '@/client/Abfahrten/hooks/useFavs';
import { useAbfahrtenFilterOpen } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCurrentAbfahrtenStopPlace } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { trpc } from '@/router';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import FilterList from '@mui/icons-material/FilterList';
import Layers from '@mui/icons-material/Layers';
import LayersClear from '@mui/icons-material/LayersClear';
import Tune from '@mui/icons-material/Tune';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useCallback, useState } from 'react';
import type { FC, SyntheticEvent } from 'react';
import { FilterModal } from './FilterModal';

export const ExtraMenu: FC = () => {
	const setFilterOpen = useAbfahrtenFilterOpen();
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const { data: lageplan } = trpc.stopPlace.lageplan.useQuery(
		currentStopPlace?.evaNumber!,
		{
			enabled: Boolean(currentStopPlace?.evaNumber),
			staleTime: Number.POSITIVE_INFINITY,
		},
	);
	const favs = useFavs();
	const fav = useFavAction();
	const unfav = useUnfavAction();
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
