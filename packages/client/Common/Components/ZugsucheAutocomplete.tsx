import { journeyMatch } from 'client/Common/service/details';
import { MenuItem, Paper, TextField } from '@material-ui/core';
import { useCallback, useState } from 'react';
import debounce from 'debounce-promise';
import Downshift from 'downshift';
import Loading, { LoadingType } from 'client/Common/Components/Loading';
import request from 'umi-request';
import useStyles from './ZugsucheAutocomplete.style';
import useWebStorage from 'client/useWebStorage';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

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
  const storage = useWebStorage();
  const [loading, setLoading] = useState(0);
  const loadOptions = useCallback(
    async (value: string) => {
      setLoading((old) => old + 1);
      const routeSettings = storage.get('rconfig');

      try {
        const suggestions = await debouncedJourneyMatch(
          value,
          initialDeparture,
          routeSettings?.hafasProfile,
          'zugsuche'
        );

        setSuggestions(suggestions.slice(0, 5));
      } catch (e) {
        if (!request.isCancel(e)) {
          setSuggestions([]);
        }
      }
      setLoading((old) => old - 1);
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
      {Boolean(loading) && (
        <Loading className={classes.loading} type={LoadingType.dots} />
      )}
    </div>
  );
};

export default ZugsucheAutocomplete;
