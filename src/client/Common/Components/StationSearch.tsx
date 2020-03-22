import { AllowedHafasProfile } from 'types/HAFAS';
import { Station, StationSearchType } from 'types/station';
import Downshift from 'downshift';
import Loading, { LoadingType } from './Loading';
import MenuItem from '@material-ui/core/MenuItem';
import MyLocation from '@material-ui/icons/MyLocation';
import Paper from '@material-ui/core/Paper';
import React, { ReactNode, SyntheticEvent, useCallback, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import useStationSearch from 'shared/hooks/useStationSearch';
import useStyles from './StationSearch.style';

export interface Props {
  id: string;
  searchType?: StationSearchType;
  value?: Station;
  onChange: (s?: Station) => any;
  autoFocus?: boolean;
  placeholder?: string;
  profile?: AllowedHafasProfile;
  maxSuggestions?: number;
  additionalIcon?: ReactNode;
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
  additionalIcon,
}: Props) => {
  const classes = useStyles({ additionalIcon });
  const inputRef = useRef<HTMLInputElement>();

  const {
    suggestions,
    setSuggestions,
    loading,
    loadOptions,
    itemToString,
    selectRef,
  } = useStationSearch({
    profile,
    searchType,
    maxSuggestions,
  });

  const getLocation = useCallback(
    (e: SyntheticEvent<any>) => {
      e.stopPropagation();
      navigator.geolocation.getCurrentPosition(
        p => {
          loadOptions(p.coords);
          selectRef.current?.openMenu();
        },
        (_e: any) => {
          // ignore for now
        }
      );
    },
    [loadOptions, selectRef]
  );

  const downshiftOnChange = useCallback(
    (station: Station | null) => {
      inputRef.current?.blur();
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
        selectedItem={value || null}
        itemToString={itemToString}
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
                setState({ inputValue: '' });
              }
              if (suggestions.length) {
                openMenu();
              }
            },
            onBlur: () => {
              setSuggestions([]);
              if (value) {
                setState({ inputValue: value.title });
              }
            },
            placeholder,
            autoFocus,
            ref: inputRef,
          });

          return (
            <div data-testid={id}>
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
        {additionalIcon}
      </div>
      {loading && (
        <Loading className={classes.loading} type={LoadingType.dots} />
      )}
    </div>
  );
};

export default React.memo(StationSearch);
