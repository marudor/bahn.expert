import { AbfahrtenState } from 'AppState';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { connect, ResolveThunks } from 'react-redux';
import { getAllTrainTypes } from 'Abfahrten/selector/abfahrten';
import { setDefaultFilter } from 'Abfahrten/actions/abfahrtenConfig';
import AbfahrtenActions, { closeFilter } from 'Abfahrten/actions/abfahrten';
import React, { SyntheticEvent, useCallback } from 'react';
import useStyles from './FilterModal.style';

type StateProps = {
  open: boolean;
  types: string[];
  filterList: string[];
};

type DispatchProps = ResolveThunks<{
  closeFilter: typeof closeFilter;
  setFilterList: typeof AbfahrtenActions.setFilterList;
  setDefaultFilter: typeof setDefaultFilter;
}>;

type ReduxProps = StateProps & DispatchProps;
type Props = ReduxProps;

const FilterModal = ({
  open,
  closeFilter,
  types,
  setFilterList,
  filterList,
  setDefaultFilter,
}: Props) => {
  const classes = useStyles();
  const toggleFilter = useCallback(
    (product: string) => (_: SyntheticEvent, checked: boolean) => {
      let newFilterList;

      if (checked) {
        newFilterList = filterList.filter(p => p !== product);
      } else {
        newFilterList = [...filterList, product];
      }
      setFilterList(newFilterList);
    },
    [filterList, setFilterList]
  );

  const saveAsDefault = useCallback(() => {
    closeFilter();
    setDefaultFilter();
  }, [closeFilter, setDefaultFilter]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={closeFilter}>
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

export default connect<StateProps, DispatchProps, {}, AbfahrtenState>(
  state => ({
    open: state.abfahrten.filterMenu,
    types: getAllTrainTypes(state),
    filterList: state.abfahrten.filterList,
  }),
  {
    closeFilter,
    setFilterList: AbfahrtenActions.setFilterList,
    setDefaultFilter,
  }
)(FilterModal);
