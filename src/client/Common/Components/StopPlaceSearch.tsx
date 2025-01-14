import { useStopPlaceSearch } from '@/client/Common/hooks/useStopPlaceSearch';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { MenuItem, Paper, TextField, styled } from '@mui/material';
import { useCombobox } from 'downshift';
import { useCallback, useRef } from 'react';
import type { ChangeEventHandler, FC, FocusEventHandler } from 'react';
import { Loading, LoadingType } from './Loading';

const PositionedLoading = styled(Loading)`
  right: 0.5em;
  top: -1em;
  position: absolute;
  transform: scale(0.5);
`;

const Container = styled('div')`
  flex: 1;
  position: relative;
`;

const SuggestionContainer = styled(Paper)(({ theme }) => ({
	background: theme.vars.palette.background.default,
	marginTop: theme.spacing(1),
	position: 'absolute',
	left: 0,
	right: 0,
	zIndex: 2,
}));

export interface Props {
	id: string;
	value?: MinimalStopPlace;
	onChange: (s?: MinimalStopPlace) => any;
	autoFocus?: boolean;
	placeholder?: string;
	maxSuggestions?: number;
	filterForIris?: boolean;
	groupedBySales?: boolean;
}

export const StopPlaceSearch: FC<Props> = ({
	id,
	onChange: stopPlaceOnChange,
	value,
	autoFocus,
	placeholder,
	maxSuggestions = 7,
	filterForIris,
	groupedBySales,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const { showRl100 } = useCommonConfig();

	const formatSuggestion = useCallback(
		(suggestion: MinimalStopPlace) => {
			let r = suggestion.name;
			if (showRl100 && suggestion?.ril100) {
				r += ` [${suggestion.ril100}]`;
			}
			return r;
		},
		[showRl100],
	);

	const { suggestions, setSuggestions, loading, loadOptions, itemToString } =
		useStopPlaceSearch({
			filterForIris,
			maxSuggestions,
			groupedBySales,
		});

	const downshiftOnChange = useCallback(
		({
			selectedItem: stopPlace,
		}: { selectedItem: MinimalStopPlace | null }) => {
			inputRef.current?.blur();
			stopPlaceOnChange(stopPlace || undefined);
		},
		[stopPlaceOnChange],
	);

	const {
		getItemProps,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		inputValue,
		isOpen,
		openMenu,
		setInputValue,
	} = useCombobox({
		id,
		items: suggestions,
		defaultHighlightedIndex: 0,
		selectedItem: value || null,
		itemToString,
		onSelectedItemChange: downshiftOnChange,
	});

	const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
		onChange: ((event) => {
			void loadOptions(event.target.value);
		}) as ChangeEventHandler<HTMLInputElement>,
		onFocus: (() => {
			if (value && value.name === inputValue) {
				setInputValue('');
			}
			if (suggestions.length) {
				openMenu();
			}
		}) as FocusEventHandler<HTMLInputElement>,
		onBlur: (() => {
			setSuggestions([]);
			if (value) {
				setInputValue(value.name);
			}
		}) as FocusEventHandler<HTMLInputElement>,
		placeholder,
		autoFocus,
		ref: inputRef,
	});

	return (
		<Container>
			<div data-testid={id}>
				<TextField
					fullWidth
					slotProps={{
						inputLabel: getLabelProps({ shrink: true }),
						input: {
							onBlur,
							onChange,
							onFocus,
						},
						htmlInput: {
							...inputProps,
							'data-testid': 'stopPlaceSearchInput',
						},
					}}
				/>
				<div {...getMenuProps()}>
					{isOpen && (
						<SuggestionContainer square>
							{suggestions.length ? (
								suggestions.map((suggestion, index) => {
									const itemProps = getItemProps({
										item: suggestion,
										index,
									});
									const highlighted = highlightedIndex === index;

									return (
										<MenuItem
											data-testid="stopPlaceSearchMenuItem"
											{...itemProps}
											key={suggestion.evaNumber}
											selected={highlighted}
											component="div"
										>
											{formatSuggestion(suggestion)}
										</MenuItem>
									);
								})
							) : (
								<MenuItem>{loading ? 'Loading...' : 'No options'}</MenuItem>
							)}
						</SuggestionContainer>
					)}
				</div>
			</div>
			{loading && <PositionedLoading type={LoadingType.dots} />}
		</Container>
	);
};
