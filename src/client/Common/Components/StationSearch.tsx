import {
  getStationsFromAPI,
  getStationsFromCoordinates,
} from 'Common/service/stationSearch';
import { Station } from 'types/station';
import { StationSearchType } from 'Common/config';
import debounce from 'debounce-promise';
import Downshift, { DownshiftInterface } from 'downshift';
import Loading, { LoadingType } from './Loading';
import MenuItem from '@material-ui/core/MenuItem';
import MyLocation from '@material-ui/icons/MyLocation';
import Paper from '@material-ui/core/Paper';
import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import useStyles from './StationSearch.style';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);

type Props = {
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
};

const TDownshift: DownshiftInterface<Station> = Downshift;
const StationSearch = ({
  onChange,
  value,
  autoFocus,
  placeholder,
  searchType,
}: Props) => {
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef();
  const inputRef = useRef<HTMLInputElement>();

  const loadOptions = useCallback(
    async (value: string | Coordinates) => {
      setLoading(true);
      let suggestions;

      if (typeof value === 'string') {
        suggestions = await debouncedGetStationFromAPI(value, searchType);
      } else {
        suggestions = await getStationsFromCoordinates(value);
      }

      setSuggestions(suggestions);
      setLoading(false);
    },
    [searchType]
  );
  const getLocation = useCallback(
    (e: SyntheticEvent<any>) => {
      e.stopPropagation();
      navigator.geolocation.getCurrentPosition(
        p => {
          loadOptions(p.coords);
          if (selectRef.current) {
            // @ts-ignore
            selectRef.current.openMenu();
          }
        },
        _e => {
          // ignore for now
        }
      );
    },
    [loadOptions]
  );

  return (
    <div className={classes.wrapper}>
      <TDownshift
        // @ts-ignore
        ref={selectRef}
        selectedItem={value || null}
        itemToString={s => (s ? s.title : '')}
        onChange={station => {
          if (station) {
            if (inputRef.current) {
              inputRef.current.blur();
            }
            onChange(station);
          }
        }}
      >
        {({
          clearSelection,
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          setState,
          selectedItem,
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
              if (value && value.title === inputValue) {
                clearSelection();
              }
              if (suggestions.length) {
                openMenu();
              }
            },
            onBlur: () => {
              setSuggestions([]);
              if (value) {
                setState({ inputValue: value.title, selectedItem: value });
              }
            },
            placeholder,
            autoFocus,
            ref: inputRef,
          });

          return (
            <div>
              <TextField
                fullWidth
                InputLabelProps={getLabelProps({ shrink: true } as any)}
                InputProps={{
                  onBlur,
                  onChange,
                  onFocus,
                }}
                inputProps={{
                  ...inputProps,
                  'data-testid': 'stationSearchInput',
                }}
              />

              <div {...getMenuProps()}>
                {isOpen && (
                  <Paper className={classes.paper} square>
                    {suggestions.length ? (
                      suggestions.map((suggestion, index) => {
                        const itemProps = getItemProps({
                          item: suggestion,
                        });
                        const selected =
                          selectedItem &&
                          selectedItem.title === suggestion.title;
                        const highlighted = highlightedIndex === index;

                        return (
                          <MenuItem
                            data-testid="stationSearchMenuItem"
                            {...itemProps}
                            key={suggestion.id}
                            selected={highlighted}
                            component="div"
                            style={{
                              fontWeight: selected ? 500 : 400,
                            }}
                          >
                            {suggestion.title}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem>
                        {loading ? 'Loading...' : 'No options'}
                      </MenuItem>
                    )}
                  </Paper>
                )}
              </div>
            </div>
          );
        }}
      </TDownshift>
      <MyLocation className={classes.geo} onClick={getLocation} />
      {loading && (
        <Loading className={classes.loading} type={LoadingType.dots} />
      )}
    </div>
  );
};

export default React.memo(StationSearch);
