import { memo, ReactNode, SyntheticEvent, useCallback, useRef } from 'react';
import Downshift from 'downshift';
import Loading, { LoadingType } from './Loading';
import MenuItem from '@material-ui/core/MenuItem';
import MyLocation from '@material-ui/icons/MyLocation';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components/macro';
import TextField from '@material-ui/core/TextField';
import useStationSearch from 'shared/hooks/useStationSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Station, StationSearchType } from 'types/station';

const Wrap = styled.div`
  flex: 1;
  position: relative;
`;

const StyledPaper = styled(Paper)`
  background: ${({ theme }) => theme.palette.background.default};
  margin-top: ${({ theme }) => theme.spacing(1)}px;
  left: 0;
  right: 0;
  z-index: 2;
`;

const StyledMenuItem = styled(MenuItem)<{ $selected?: boolean }>`
  font-weight: ${({ $selected }) => ($selected ? 500 : 400)};
`;

const Icons = styled.div`
  > svg {
    font-size: 1.3em;
    vertical-align: middle;
  }
  position: absolute;
  right: 0;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
`;

const StyledLoading = styled(Loading)<{ additionalIcon?: boolean }>`
  right: ${({ additionalIcon }) => (additionalIcon ? '1.7' : '.5')}em;
  top: -1em;
  position: absolute;
  transform: scale(0.5);
`;

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
    <Wrap>
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
                  <StyledPaper square>
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
                          <StyledMenuItem
                            data-testid="stationSearchMenuItem"
                            {...itemProps}
                            key={suggestion.id}
                            selected={highlighted}
                            $selected={selected}
                            component="div"
                          >
                            {suggestion.title}
                          </StyledMenuItem>
                        );
                      })
                    ) : (
                      <MenuItem>
                        {loading ? 'Loading...' : 'No options'}
                      </MenuItem>
                    )}
                  </StyledPaper>
                )}
              </div>
            </div>
          );
        }}
      </Downshift>
      <Icons>
        <MyLocation onClick={getLocation} />
        {additionalIcon}
      </Icons>
      {loading && (
        <StyledLoading
          additionalIcon={Boolean(additionalIcon)}
          type={LoadingType.dots}
        />
      )}
    </Wrap>
  );
};

export default memo(StationSearch);
