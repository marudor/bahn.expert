import { journeyMatch } from 'client/Common/service/details';
import { Loading, LoadingType } from 'client/Common/Components/Loading';
import { MenuItem, Paper, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useStorage } from 'client/useStorage';
import Axios from 'axios';
import debounce from 'debounce-promise';
import Downshift from 'downshift';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

const debouncedJourneyMatch = debounce(journeyMatch, 300);

const Container = styled.div`
  position: relative;
  margin: 20px;
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
  onChange: (match: ParsedJourneyMatchResponse | null) => any;
}
const itemToString = (j: ParsedJourneyMatchResponse | null) =>
  j?.train.name || '';
export const ZugsucheAutocomplete: FC<Props> = ({
  initialDeparture = new Date(),
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState<ParsedJourneyMatchResponse[]>(
    [],
  );
  const storage = useStorage();
  const [loading, setLoading] = useState(0);
  const loadOptions = useCallback(
    async (value: string) => {
      setLoading((old) => old + 1);
      try {
        const suggestions = await debouncedJourneyMatch(
          value,
          initialDeparture,
          storage.get('hafasProfile'),
          'zugsuche',
        );

        setSuggestions(suggestions);
      } catch (e) {
        if (!Axios.isCancel(e)) {
          setSuggestions([]);
        }
      }
      setLoading((old) => old - 1);
    },
    [initialDeparture, storage],
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
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value === '') {
                clearSelection();
              } else {
                void loadOptions(event.target.value);
              }
            },
            onFocus: () => {
              if (suggestions.length) {
                openMenu();
              }
            },
            onBlur: () => {
              openMenu();
              setSuggestions([]);
            },
          });

          return (
            <div>
              <TextField
                fullWidth
                label="Zug"
                placeholder="z.B. ICE 71"
                InputLabelProps={getLabelProps({ shrink: true } as any)}
                InputProps={{
                  onBlur,
                  onChange,
                  onFocus,
                }}
                inputProps={{
                  ...inputProps,
                  'data-testid': 'zugsucheAutocompleteInput',
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
                            component="div"
                          >
                            {suggestion.train.name} -&gt;
                            <br />
                            {suggestion.lastStop.station.title}
                          </StyledMenuItem>
                        );
                      })
                    ) : (
                      <StyledMenuItem>
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
