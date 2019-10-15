import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { closeFilter } from 'Abfahrten/actions/abfahrten';
import { useAbfahrtenSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import React, { useCallback } from 'react';
import useAllTrainTypes from 'Abfahrten/hooks/useAllTrainTypes';
import useStyles from './FilterModal.style';

const FilterModal = () => {
  const dispatch = useDispatch();
  const {
    productFilter,
    toggleProduct,
    saveProductFilter,
  } = AbfahrtenConfigContainer.useContainer();
  const open = useAbfahrtenSelector(state => state.abfahrten.filterMenu);
  const types = useAllTrainTypes();
  const classes = useStyles();
  const toggleFilter = useCallback(
    (product: string) => () => {
      toggleProduct(product);
    },
    [toggleProduct]
  );

  const closeFilterM = useCallback(() => {
    dispatch(closeFilter());
  }, [dispatch]);

  const saveAsDefault = useCallback(() => {
    dispatch(closeFilter());
    saveProductFilter();
  }, [dispatch, saveProductFilter]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={closeFilterM}>
      <DialogContent>
        <h4>Train Types</h4>
        {types.map(t => (
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
