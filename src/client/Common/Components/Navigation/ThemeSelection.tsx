import {
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { capitalize } from 'lodash';
import { ThemeType } from 'client/Themes/type';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PaletteIcon from '@material-ui/icons/Palette';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import ThemeContainer from 'Common/container/ThemeContainer';
import useStyles from './ThemeSelection.style';

const ThemeSelection = () => {
  const { themeType, setTheme } = ThemeContainer.useContainer();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const selectTheme = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const newThemeType = e.currentTarget.dataset.value as
        | undefined
        | ThemeType;

      if (newThemeType) {
        setTheme(newThemeType);
      }
    },
    [setTheme]
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
        <ListItemIcon>
          <PaletteIcon />
        </ListItemIcon>
        <ListItemText primary="Themes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding className={classes.nested} data-testid="themeList">
          {Object.values(ThemeType).map(themeOption => {
            const name = capitalize(themeOption);

            return (
              <ListItem
                key={themeOption}
                button
                onClick={selectTheme}
                data-value={themeOption}
              >
                {themeOption === themeType ? (
                  <Badge color="primary" variant="dot">
                    <Typography>{name}</Typography>
                  </Badge>
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default ThemeSelection;
