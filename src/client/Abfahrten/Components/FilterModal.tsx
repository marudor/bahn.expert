import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { getAllTrainTypes } from 'Abfahrten/selector/abfahrten';
import { setDefaultFilter } from 'Abfahrten/actions/abfahrtenConfig';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAbfahrtenSelector } from 'useSelector';
import AbfahrtenActions, { closeFilter } from 'Abfahrten/actions/abfahrten';
import React, { SyntheticEvent, useCallback } from 'react';
import useStyles from './FilterModal.style';

const FilterModal = () => {
  const dispatch = useDispatch();
  const { open, types, filterList } = useAbfahrtenSelector(
    state => ({
      open: state.abfahrten.filterMenu,
      types: getAllTrainTypes(state),
      filterList: state.abfahrten.filterList,
    }),
    shallowEqual
  );
  const classes = useStyles();
  const toggleFilter = useCallback(
    (product: string) => (_: SyntheticEvent, checked: boolean) => {
      let newFilterList;

      if (checked) {
        newFilterList = filterList.filter(p => p !== product);
      } else {
        newFilterList = [...filterList, product];
      }
      dispatch(AbfahrtenActions.setFilterList(newFilterList));
    },
    [dispatch, filterList]
  );

  const closeFilterM = useCallback(() => {
    dispatch(closeFilter());
  }, [dispatch]);

  const saveAsDefault = useCallback(() => {
    dispatch(closeFilter());
    dispatch(setDefaultFilter());
  }, [dispatch]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={closeFilterM}>
      <DialogTitle>Train Type</DialogTitle>
      <DialogContent>
        {types.map(t => (
          <FormControlLabel
            className={classes.label}
            key={t}
            control={
              <Switch
                checked={filterList.length ? !filterList.includes(t) : true}
                onChange={toggleFilter(t)}
                value={t}
              />
            }
            label={t}
          />
        ))}
        <Button fullWidth variant="contained" onClick={saveAsDefault}>
          Save as default
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
