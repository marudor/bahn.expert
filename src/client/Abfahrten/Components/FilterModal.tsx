import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useCallback } from 'react';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import useAllTrainTypes from 'Abfahrten/container/AbfahrtenContainer/useAllTrainTypes';
import useStyles from './FilterModal.style';

const FilterModal = () => {
  const {
    productFilter,
    toggleProduct,
    saveProductFilter,
    filterOpen,
    setFilterOpen,
  } = AbfahrtenConfigContainer.useContainer();
  const types = useAllTrainTypes();
  const classes = useStyles();
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
          <FormControlLabel
            className={classes.label}
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

export default FilterModal;
