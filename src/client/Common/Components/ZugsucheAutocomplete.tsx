import { journeyMatch } from 'Common/service/details';
import { MenuItem, Paper, TextField } from '@material-ui/core';
import { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import { useCallback, useState } from 'react';
import debounce from 'debounce-promise';
import Downshift from 'downshift';
import Loading, { LoadingType } from 'Common/Components/Loading';
import React from 'react';
import useStorage from 'shared/hooks/useStorage';
import useStyles from './ZugsucheAutocomplete.style';

const debouncedJourneyMatch = debounce(journeyMatch, 300);

interface Props {
  initialDeparture?: number;
  onChange: (match: ParsedJourneyMatchResponse | null) => any;
}
const itemToString = (j: ParsedJourneyMatchResponse | null) =>
  j?.train.name || '';
const ZugsucheAutocomplete = ({
  initialDeparture = Date.now(),
  onChange,
}: Props) => {
  const [suggestions, setSuggestions] = useState<ParsedJourneyMatchResponse[]>(
    []
  );
  const classes = useStyles();
  const storage = useStorage();
  const [loading, setLoading] = useState(false);
  const loadOptions = useCallback(
    async (value: string) => {
      setLoading(true);
      const routeSettings = storage.get('rconfig');

      try {
        const suggestions = await debouncedJourneyMatch(
          value,
          initialDeparture,
          routeSettings?.hafasProfile
        );

        setSuggestions(suggestions.slice(0, 5));
      } catch {
        setSuggestions([]);
      }
      setLoading(false);
    },
    [initialDeparture, storage]
  );

  return (
    <div className={classes.wrapper}>
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
                loadOptions(event.target.value);
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
                autoFocus
                fullWidth
                placeholder="Zug (z.B. ICE 71)"
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
                        const selected = false;
                        const highlighted = highlightedIndex === index;

                        return (
                          <MenuItem
                            data-testid="zugsucheAutocompleteItem"
                            {...itemProps}
                            key={suggestion.jid}
                            selected={highlighted}
                            component="div"
                            style={{
                              fontWeight: selected ? 500 : 400,
                            }}
                          >
                            {suggestion.train.name} -&gt;
                            <br />
                            {suggestion.lastStop.station.title}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem>
                        {loading ? 'Loading...' : 'No Matching Trains'}
                      </MenuItem>
                    )}
                  </Paper>
                )}
              </div>
            </div>
          );
        }}
      </Downshift>
      {loading && (
        <Loading className={classes.loading} type={LoadingType.dots} />
      )}
    </div>
  );
};

export default ZugsucheAutocomplete;
