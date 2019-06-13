import { closeTheme, setTheme } from 'Common/actions/config';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { ThemeType } from 'client/Themes/type';
import { useCommonSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import React, { ChangeEvent, useCallback } from 'react';

const ThemeModal = () => {
  const dispatch = useDispatch();
  const setThemeCb = useCallback(
    (_: ChangeEvent<{}>, value: string) => {
      dispatch(setTheme(value as ThemeType));
    },
    [dispatch]
  );
  const open = useCommonSelector(state => state.config.themeMenu);
  const theme = useCommonSelector(state => state.config.theme);

  return (
    <Dialog maxWidth="md" open={open} onClose={() => dispatch(closeTheme())}>
      <DialogTitle>Themes</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Theme"
            name="theme"
            value={theme}
            onChange={setThemeCb}
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="black" control={<Radio />} label="Black" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ThemeModal);
