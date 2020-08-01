import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useAllTrainTypes } from 'client/Abfahrten/container/AbfahrtenContainer/useAllTrainTypes';
import { useCallback } from 'react';
import styled from 'styled-components';

const Label = styled(FormControlLabel)`
  width: calc(50% - 1em);
`;

export const FilterModal = () => {
  const {
    productFilter,
    toggleProduct,
    saveProductFilter,
    filterOpen,
    setFilterOpen,
  } = AbfahrtenConfigContainer.useContainer();
  const types = useAllTrainTypes();
  const toggleFilter = useCallback(
    (product: string) => () => {
      toggleProduct(product);
    },
    [toggleProduct]
  );

  const closeFilterM = useCallback(() => {
    setFilterOpen(false);
  }, [setFilterOpen]);

  const saveAsDefault = useCallback(() => {
    setFilterOpen(false);
    saveProductFilter();
  }, [saveProductFilter, setFilterOpen]);

  return (
    <Dialog maxWidth="md" fullWidth open={filterOpen} onClose={closeFilterM}>
      <DialogContent>
        <h4>Train Types</h4>
        {types.map((t) => (
          <Label
            data-testid={`filter${t}`}
            key={t}
            control={
              <Switch
                checked={
                  productFilter.length ? !productFilter.includes(t) : true
                }
                onChange={toggleFilter(t)}
                value={t}
              />
            }
            label={t}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button data-testid="filterSubmit" fullWidth onClick={saveAsDefault}>
          Save as default
        </Button>
      </DialogActions>
    </Dialog>
  );
};
