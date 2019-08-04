import { availableThemes, ThemeType } from 'client/Themes/type';
import { capitalize } from 'lodash';
import { Collapse, List, ListItem, ListItemText } from '@material-ui/core';
import { setTheme } from 'Common/actions/config';
import { useCommonSelector } from 'useSelector';
import { useDispatch } from 'react-redux';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import useStyles from './ThemeSelection.style';

const ThemeSelection = () => {
  const theme = useCommonSelector(state => state.config.theme);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const selectTheme = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const newTheme = e.currentTarget.dataset.value as undefined | ThemeType;

      if (newTheme) {
        dispatch(setTheme(newTheme));
      }
    },
    [dispatch]
  );
  const toggle = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItem data-testid="themes" button onClick={toggle}>
        <ListItemText primary="Themes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={classes.nested} data-testid="themeList">
          {availableThemes.map(themeOption => {
            let name = capitalize(themeOption);

            if (themeOption === theme) {
              name = `* ${name}`;
            }

            return (
              <ListItem
                key={themeOption}
                button
                onClick={selectTheme}
                data-value={themeOption}
              >
                <ListItemText primary={name} />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default ThemeSelection;
