import { AllowedHafasProfile } from 'types/HAFAS';
import {
  getHafasStationFromAPI,
  getHafasStationFromCoordinates,
  getStationsFromAPI,
  getStationsFromCoordinates,
} from 'Common/service/stationSearch';
import { Station, StationSearchType } from 'types/station';
import debounce from 'debounce-promise';
import Downshift from 'downshift';
import Loading, { LoadingType } from './Loading';
import MenuItem from '@material-ui/core/MenuItem';
import MyLocation from '@material-ui/icons/MyLocation';
import Paper from '@material-ui/core/Paper';
import React, {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import TextField from '@material-ui/core/TextField';
import useStyles from './StationSearch.style';

const debouncedGetStationFromAPI = debounce(getStationsFromAPI, 500);
const debouncedHafasStationFromAPI = debounce(getHafasStationFromAPI, 500);

interface Props {
  id: string;
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s?: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
  profile?: AllowedHafasProfile;
  maxSuggestions?: number;
  additionalIcons?: ReactNode;
}

const StationSearch = ({
  id,
  onChange,
  value,
  autoFocus,
  placeholder,
  searchType,
  profile,
  maxSuggestions = 7,
  additionalIcons,
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

  const downshiftOnChange = useCallback(
    (station: Station | null) => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      onChange(station || undefined);
    },
    [onChange]
  );

  return (
    <div className={classes.wrapper}>
      <Downshift
        id={id}
        defaultHighlightedIndex={0}
        // @ts-ignore
        ref={selectRef}
        selectedItem={value}
        itemToString={s => (s ? s.title : '')}
        onChange={downshiftOnChange}
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
                          index,
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
      </Downshift>
      <div className={classes.icons}>
        <MyLocation onClick={getLocation} />
        {additionalIcons}
      </div>
      {loading && (
        <Loading className={classes.loading} type={LoadingType.dots} />
      )}
    </div>
  );
};

export default React.memo(StationSearch);
