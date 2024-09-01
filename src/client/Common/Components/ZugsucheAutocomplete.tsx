import { Loading, LoadingType } from '@/client/Common/Components/Loading';
import { trpc } from '@/client/RPC';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import { MenuItem, Paper, TextField, styled } from '@mui/material';
import Axios from 'axios';
import debounce from 'debounce-promise';
import Downshift from 'downshift';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEventHandler, FC, FocusEventHandler } from 'react';

const Container = styled('div')`
  position: relative;
  margin: 20px;

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

const PositionedLoading = styled(Loading)`
  position: absolute;
  top: 0;
  right: 1.1em;
  transform: scale(0.5);
`;

const StyledMenuItem = styled(MenuItem)`
  white-space: initial;
`;

interface Props {
	initialDeparture?: Date;
	filtered?: boolean;
	onChange: (match: ParsedJourneyMatchResponse | null) => any;
}
const itemToString = (j: ParsedJourneyMatchResponse | null) =>
	j?.train.name || '';
export const ZugsucheAutocomplete: FC<Props> = ({
	initialDeparture = new Date(),
	onChange,
	filtered,
}) => {
	const [suggestions, setSuggestions] = useState<ParsedJourneyMatchResponse[]>(
		[],
	);
	const [loading, setLoading] = useState(0);
	const trpcUtils = trpc.useUtils();
	const debouncedFindByNumer = useMemo(
		() => debounce(trpcUtils.journeys.findByNumber.fetch, 200),
		[trpcUtils.journeys.findByNumber],
	);
	const loadOptions = useCallback(
		async (value: string) => {
			const enteredNumber = Number.parseInt(value);
			if (Number.isNaN(enteredNumber)) {
				return;
			}
			setLoading((old) => old + 1);
			try {
				const suggestions = await debouncedFindByNumer({
					trainNumber: enteredNumber,
					initialDepartureDate: initialDeparture,
					filtered,
				});

				setSuggestions(suggestions);
			} catch (e) {
				if (!Axios.isCancel(e)) {
					setSuggestions([]);
				}
			}
			setLoading((old) => old - 1);
		},
		[initialDeparture, filtered, debouncedFindByNumer],
	);

	return (
		<Container>
			<Downshift
				onChange={onChange}
				itemToString={itemToString}
				defaultHighlightedIndex={0}
			>
				{({
					clearSelection,
					getInputProps,
					getItemProps,
					getLabelProps,
					getMenuProps,
					highlightedIndex,
					isOpen,
					openMenu,
				}) => {
					const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
						onChange: ((event) => {
							if (event.target.value === '') {
								clearSelection();
							} else {
								void loadOptions(event.target.value);
							}
						}) as ChangeEventHandler<HTMLInputElement>,
						onFocus: (() => {
							if (suggestions.length) {
								openMenu();
							}
						}) as FocusEventHandler<HTMLInputElement>,
						onBlur: (() => {
							openMenu();
							setSuggestions([]);
						}) as FocusEventHandler<HTMLInputElement>,
					});

					return (
						<div>
							<TextField
								fullWidth
								label="Zugnummer"
								placeholder="z.B. 71"
								InputLabelProps={getLabelProps({ shrink: true } as any)}
								InputProps={{
									onBlur,
									onChange,
									onFocus,
									type: 'number',
									autoFocus: true,
								}}
								inputProps={{
									...inputProps,
									'data-testid': 'zugsucheAutocompleteInput',
									inputMode: 'numeric',
								}}
							/>

							<div {...getMenuProps()}>
								{isOpen && (
									<Paper square>
										{suggestions.length ? (
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
														// @ts-expect-error ???
														component="div"
													>
														{suggestion.train.name} -&gt;
														<br />
														{suggestion.lastStop.station.name}
													</StyledMenuItem>
												);
											})
										) : (
											<StyledMenuItem key="loading">
												{loading ? 'Loading...' : 'No Matching Trains'}
											</StyledMenuItem>
										)}
									</Paper>
								)}
							</div>
						</div>
					);
				}}
			</Downshift>
			{Boolean(loading) && <PositionedLoading type={LoadingType.dots} />}
		</Container>
	);
};
