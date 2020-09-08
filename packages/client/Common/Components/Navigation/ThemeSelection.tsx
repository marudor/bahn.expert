import {
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Palette } from '@material-ui/icons';
import { ThemeType } from 'client/Themes/type';
import { useCallback, useState } from 'react';
import { useTheme } from 'client/Common/provider/ThemeProvider';
import type { FC, SyntheticEvent } from 'react';

const useStyles = makeStyles((theme) => ({
  themeList: {
    paddingLeft: theme.spacing(1),
  },
}));

export const ThemeSelection: FC = () => {
  const classes = useStyles();
  const { themeType, setThemeType } = useTheme();
  const [open, setOpen] = useState(false);
  const selectTheme = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const newThemeType = e.currentTarget.dataset.value as
        | undefined
        | ThemeType;

      if (newThemeType) {
        setThemeType(newThemeType);
      }
    },
    [setThemeType],
  );
  const toggle = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      setOpen(!open);
    },
    [open],
  );

  return (
    <>
      <ListItem data-testid="themes" button onClick={toggle}>
        <ListItemIcon>
          <Palette />
        </ListItemIcon>
        <ListItemText primary="Themes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          className={classes.themeList}
          disablePadding
          data-testid="themeList"
        >
          {Object.values(ThemeType).map((themeOption) => {
            const name = themeOption[0].toUpperCase() + themeOption.slice(1);

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
