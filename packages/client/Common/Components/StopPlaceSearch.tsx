import { Loading, LoadingType } from './Loading';
import { makeStyles, MenuItem, Paper, TextField } from '@material-ui/core';
import { MyLocation } from '@material-ui/icons';
import { useCallback, useRef } from 'react';
import { useStopPlaceSearch } from 'client/Common/hooks/useStopPlaceSearch';
import Downshift from 'downshift';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { FC, ReactNode, SyntheticEvent } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';

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
  value?: MinimalStopPlace;
  onChange: (s?: MinimalStopPlace) => any;
  autoFocus?: boolean;
  placeholder?: string;
  profile?: AllowedHafasProfile;
  maxSuggestions?: number;
  additionalIcon?: ReactNode;
  filterForIris?: boolean;
  groupedBySales?: boolean;
}

export const StopPlaceSearch: FC<Props> = ({
  id,
  onChange,
  value,
  autoFocus,
  placeholder,
  maxSuggestions = 7,
  additionalIcon,
  filterForIris = false,
  groupedBySales = false,
}) => {
  const classes = useStyles({ additionalIcon: Boolean(additionalIcon) });
  const inputRef = useRef<HTMLInputElement>();

  const {
    suggestions,
    setSuggestions,
    loading,
    loadOptions,
    itemToString,
    selectRef,
  } = useStopPlaceSearch({
    filterForIris,
    maxSuggestions,
    groupedBySales,
  });

  const getLocation = useCallback(
    (e: SyntheticEvent<any>) => {
      e.stopPropagation();
      navigator.geolocation.getCurrentPosition(
        (p) => {
          void loadOptions(p.coords);
          selectRef.current?.openMenu();
        },
        (e: any) => {
          console.error(e);
        },
      );
    },
    [loadOptions, selectRef],
  );

  const downshiftOnChange = useCallback(
    (stopPlace: MinimalStopPlace | null) => {
      inputRef.current?.blur();
      onChange(stopPlace || undefined);
    },
    [onChange],
  );

  return (
    <div className={classes.wrap}>
      <Downshift
        id={id}
        defaultHighlightedIndex={0}
        // @ts-expect-error typing for ref wrong
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
                void loadOptions(event.target.value);
              }
            },
            onFocus: () => {
              if (value && value.name === inputValue) {
                setState({ inputValue: '' });
              }
              if (suggestions.length) {
                openMenu();
              }
            },
            onBlur: () => {
              setSuggestions([]);
              if (value) {
                setState({ inputValue: value.name });
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
                  'data-testid': 'stopPlaceSearchInput',
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
                          selectedItem && selectedItem.name === suggestion.name;
                        const highlighted = highlightedIndex === index;

                        return (
                          <MenuItem
                            className={
                              selected
                                ? classes.selectedMenuItem
                                : classes.menuItem
                            }
                            data-testid="stopPlaceSearchMenuItem"
                            {...itemProps}
                            key={suggestion.evaNumber}
                            selected={highlighted}
                            component="div"
                          >
                            {suggestion.name}
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
