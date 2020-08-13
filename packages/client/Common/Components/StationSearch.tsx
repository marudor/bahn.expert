import { Loading, LoadingType } from './Loading';
import { makeStyles, MenuItem, Paper, TextField } from '@material-ui/core';
import { MyLocation } from '@material-ui/icons';
import { ReactNode, SyntheticEvent, useCallback, useRef } from 'react';
import { useStationSearch } from 'client/Common/hooks/useStationSearch';
import Downshift from 'downshift';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Station, StationSearchType } from 'types/station';

const useStyles = makeStyles((theme) => ({
  wrap: {
    flex: 1,
    position: 'relative',
  },
  menuWrap: {
    background: theme.palette.background.default,
    marginTop: theme.spacing(1),
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  menuItem: {
    fontWeight: 400,
  },
  selectedMenuItem: {
    fontWeight: 500,
  },
  icons: {
    '& > svg': {
      fontSize: '1.3em',
      verticalAlign: 'center',
    },
    position: 'absolute',
    right: 0,
    cursor: 'pointer',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  loading: ({ additionalIcon }: { additionalIcon: boolean }) => ({
    right: additionalIcon ? '1.7em' : '.5em',
    top: '-1em',
    position: 'absolute',
    transform: 'scale(.5)',
  }),
}));

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

export const StationSearch = ({
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
  const classes = useStyles({ additionalIcon: Boolean(additionalIcon) });
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
        (p) => {
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
    <div className={classes.wrap}>
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
                  <Paper className={classes.menuWrap} square>
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
                            className={
                              selected
                                ? classes.selectedMenuItem
                                : classes.menuItem
                            }
                            data-testid="stationSearchMenuItem"
                            {...itemProps}
                            key={suggestion.id}
                            selected={highlighted}
                            component="div"
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
