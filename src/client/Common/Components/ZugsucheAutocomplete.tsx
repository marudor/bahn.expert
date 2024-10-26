import { Loading, LoadingType } from '@/client/Common/Components/Loading';
import { trpc } from '@/client/RPC';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import { MenuItem, Paper, TextField, styled } from '@mui/material';
import debounce from 'debounce-promise';
import { useCombobox } from 'downshift';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ChangeEventHandler, FC } from 'react';

const Container = styled('div')`
  position: relative;
  margin: 20px;
	display: flex;
	flex-direction: column;

  input[type='number'] {
    -moz-appearance: textfield;
		appearance: textfield;
  }
  input[type='number']:hover,
  input[type='number']:focus {
    -moz-appearance: number-input;
		appearance: number-input;
  }
`;

const SuggestionContainer = styled(Paper)`
	overflow-y: auto;
`;

const PositionedLoading = styled(Loading)`
  position: absolute;
  top: 0;
  right: 1.1em;
  transform: scale(0.5);
`;

const StyledMenuItem = styled(MenuItem)`
  white-space: initial;
` as typeof MenuItem;

interface Props {
	initialDeparture?: Date;
	withOEV?: boolean;
	onChange: (match: ParsedJourneyMatchResponse | null) => any;
}
const itemToString = (j: ParsedJourneyMatchResponse | null) =>
	j?.train.name || '';
export const ZugsucheAutocomplete: FC<Props> = ({
	initialDeparture = new Date(),
	onChange: onSelectedItemChange,
	withOEV,
}) => {
	const [suggestions, setSuggestions] = useState<ParsedJourneyMatchResponse[]>(
		[],
	);
	const inputRef = useRef();
	const [loading, setLoading] = useState(0);
	const trpcUtils = trpc.useUtils();
	const debouncedFindByNumber = useMemo(
		() => debounce(trpcUtils.journey.findByNumber.fetch, 320),
		[trpcUtils.journey.findByNumber],
	);
	const loadOptions = useCallback(
		async (value: string) => {
			const enteredNumber = Number.parseInt(value);
			if (Number.isNaN(enteredNumber)) {
				return;
			}
			setLoading((old) => old + 1);
			const suggestions = await debouncedFindByNumber({
				trainNumber: enteredNumber,
				initialDepartureDate: initialDeparture,
				withOEV,
			});

			setSuggestions(suggestions);
			setLoading((old) => old - 1);
		},
		[initialDeparture, withOEV, debouncedFindByNumber],
	);

	const {
		openMenu,
		isOpen,
		getLabelProps,
		getMenuProps,
		getInputProps,
		highlightedIndex,
		getItemProps,
	} = useCombobox({
		items: suggestions,
		defaultHighlightedIndex: 0,
		itemToString,
		onSelectedItemChange: (e) => {
			if (e.type !== '__input_blur__') {
				onSelectedItemChange(e.selectedItem);
			}
		},
	});

	const { onChange, value, ...inputProps } = getInputProps({
		onChange: ((event) => {
			if (event.target.value === '') {
				setSuggestions([]);
			} else {
				void loadOptions(event.target.value);
			}
		}) as ChangeEventHandler<HTMLInputElement>,
	});

	return (
		<Container>
			<TextField
				inputRef={inputRef}
				fullWidth
				label="Zugnummer"
				placeholder="z.B. 71"
				slotProps={{
					inputLabel: getLabelProps({ shrink: true }),
					input: {
						onChange,
						type: 'number',
						autoFocus: true,
					},
					htmlInput: {
						...inputProps,
						value,
						'data-testid': 'zugsucheAutocompleteInput',
						inputMode: 'numeric',
					},
				}}
			/>
			{
				<SuggestionContainer square {...getMenuProps()}>
					{value &&
						(suggestions.length ? (
							suggestions.map((suggestion, index) => {
								const itemProps = getItemProps({
									item: suggestion,
								});
								const highlighted = highlightedIndex === index;
								return (
									<StyledMenuItem
										data-testid="zugsucheAutocompleteItem"
										{...itemProps}
										key={suggestion.jid}
										selected={highlighted}
										component="div"
									>
										{suggestion.train.name} -&gt;
										<br key={suggestion.jid} />
										{suggestion.lastStop.station.name}
									</StyledMenuItem>
								);
							})
						) : (
							<StyledMenuItem key="loading">
								{loading ? 'Loading...' : 'No Matching Trains'}
							</StyledMenuItem>
						))}
				</SuggestionContainer>
			}
			{Boolean(loading) && <PositionedLoading type={LoadingType.dots} />}
		</Container>
	);
};
