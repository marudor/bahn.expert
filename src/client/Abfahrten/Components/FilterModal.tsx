import { useAbfahrtenFilter } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useAllTrainTypes } from '@/client/Abfahrten/provider/AbfahrtenProvider/hooks';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	FormControlLabel,
	Switch,
	styled,
} from '@mui/material';
import { useCallback } from 'react';
import type { FC } from 'react';

const Label = styled(FormControlLabel)`
  width: calc(50% - 1em);
`;

export const FilterModal: FC = () => {
	const {
		productFilter,
		toggleProduct,
		saveProductFilter,
		filterOpen,
		setFilterOpen,
	} = useAbfahrtenFilter();
	const types = useAllTrainTypes();
	const toggleFilter = useCallback(
		(product: string) => () => {
			toggleProduct(product);
		},
		[toggleProduct],
	);

	const closeFilterM = useCallback(() => {
		setFilterOpen(false);
	}, [setFilterOpen]);

	const saveAsDefault = useCallback(() => {
		setFilterOpen(false);
		saveProductFilter();
	}, [saveProductFilter, setFilterOpen]);

	return (
		<Dialog maxWidth="md" fullWidth open={filterOpen} onClose={closeFilterM}>
			<DialogContent>
				<h4>Zug Typen</h4>
				{types.map((t) => (
					<Label
						data-testid={`filter${t}`}
						key={t}
						control={
							<Switch
								checked={
									productFilter.length ? !productFilter.includes(t) : true
								}
								onChange={toggleFilter(t)}
								value={t}
							/>
						}
						label={t}
					/>
				))}
			</DialogContent>
			<DialogActions>
				<Button data-testid="filterSubmit" fullWidth onClick={saveAsDefault}>
					Save as default
				</Button>
			</DialogActions>
		</Dialog>
	);
};
