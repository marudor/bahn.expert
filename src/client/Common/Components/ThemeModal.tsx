import { AbfahrtenState, CommonState } from 'AppState';
import { closeTheme, setTheme } from 'Common/actions/config';
import { connect, ResolveThunks } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { ThemeType } from 'client/Themes';
import React, { ChangeEvent, useCallback } from 'react';

type StateProps = {
  open: boolean;
  theme: ThemeType;
};

type DispatchProps = ResolveThunks<{
  closeTheme: typeof closeTheme;
  setTheme: typeof setTheme;
}>;

type ReduxProps = StateProps & DispatchProps;
type Props = ReduxProps;

const FilterModal = ({ open, closeTheme, setTheme, theme }: Props) => {
  const setThemeCb = useCallback(
    (e: ChangeEvent<{}>, value: string) => {
      setTheme(value as ThemeType);
    },
    [setTheme]
  );

  return (
    <Dialog maxWidth="md" open={open} onClose={closeTheme}>
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

export default connect<StateProps, DispatchProps, {}, CommonState>(
  state => ({
    open: state.config.themeMenu,
    theme: state.config.theme,
  }),
  {
    closeTheme,
    setTheme,
  }
)(FilterModal);
