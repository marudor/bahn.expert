import { Loading, LoadingType } from './Loading';
import { MenuItem, Paper, TextField } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useStopPlaceSearch } from '@/client/Common/hooks/useStopPlaceSearch';
import Downshift from 'downshift';
import styled from '@emotion/styled';
import type { AllowedHafasProfile } from '@/types/HAFAS';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

const PositionedLoading = styled(Loading)`
  right: 0.5em;
  top: -1em;
  position: absolute;
  transform: scale(0.5);
`;

const Container = styled.div`
  flex: 1;
  position: relative;
`;

const SuggestionContainer = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.default,
  marginTop: theme.spacing(1),
  position: 'absolute',
  left: 0,
  right: 0,
  zIndex: 2,
}));

export interface Props {
  id: string;
  value?: MinimalStopPlace;
  onChange: (s?: MinimalStopPlace) => any;
  autoFocus?: boolean;
  placeholder?: string;
  profile?: AllowedHafasProfile;
  maxSuggestions?: number;
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
  filterForIris,
  groupedBySales,
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const { showRl100 } = useCommonConfig();

  const formatSuggestion = useCallback(
    (suggestion: MinimalStopPlace) => {
      let r = suggestion.name;
      if (showRl100 && suggestion?.ril100) {
        r += ` [${suggestion.ril100}]`;
      }
      return r;
    },
    [showRl100],
  );

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

  const downshiftOnChange = useCallback(
    (stopPlace: MinimalStopPlace | null) => {
      inputRef.current?.blur();
      onChange(stopPlace || undefined);
    },
    [onChange],
  );

  return (
    <Container>
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
                  <SuggestionContainer square>
                    {suggestions.length ? (
                      suggestions.map((suggestion, index) => {
                        const itemProps = getItemProps({
                          item: suggestion,
                          index,
                        });
                        const highlighted = highlightedIndex === index;

                        return (
                          <MenuItem
                            data-testid="stopPlaceSearchMenuItem"
                            {...itemProps}
                            key={suggestion.evaNumber}
                            selected={highlighted}
                            component="div"
                          >
                            {formatSuggestion(suggestion)}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem>
                        {loading ? 'Loading...' : 'No options'}
                      </MenuItem>
                    )}
                  </SuggestionContainer>
                )}
              </div>
            </div>
          );
        }}
      </Downshift>
      {loading && <PositionedLoading type={LoadingType.dots} />}
    </Container>
  );
};
