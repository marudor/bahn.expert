import { AllowedHafasProfile } from 'types/HAFAS';
import {
  getHafasStationFromAPI,
  getHafasStationFromCoordinates,
  getStationsFromAPI,
  getStationsFromCoordinates,
} from 'Common/service/stationSearch';
import { Station, StationSearchType } from 'types/station';
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
const debouncedHafasStationFromAPI = debounce(getHafasStationFromAPI, 500);

type Props = {
  id: string;
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
  profile?: AllowedHafasProfile;
  maxSuggestions?: number;
};

const TDownshift: DownshiftInterface<Station> = Downshift;
const StationSearch = ({
  id,
  onChange,
  value,
  autoFocus,
  placeholder,
  searchType,
  profile,
  maxSuggestions = 7,
}: Props) => {
  const classes = useStyles();
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const selectRef = useRef();
  const inputRef = useRef<HTMLInputElement>();

  const loadOptions = useCallback(
    async (value: string | Coordinates) => {
      setLoading(true);
      let suggestions: Station[];

      const stationFn = profile
        ? debouncedHafasStationFromAPI.bind(undefined, profile)
        : debouncedGetStationFromAPI.bind(undefined, searchType);

      const geoFn = profile
        ? getHafasStationFromCoordinates.bind(undefined, profile)
        : getStationsFromCoordinates;

      if (typeof value === 'string') {
        suggestions = await stationFn(value);
      } else {
        suggestions = await geoFn(value);
      }

      if (maxSuggestions) {
        suggestions = suggestions.slice(0, maxSuggestions);
      }

      setSuggestions(suggestions);
      setLoading(false);
    },
    [maxSuggestions, profile, searchType]
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
        id={id}
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
