import {
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore, Palette } from '@material-ui/icons';
import { SyntheticEvent, useCallback, useState } from 'react';
import { ThemeContainer } from 'client/Common/container/ThemeContainer';
import { ThemeType } from 'client/Themes/type';
import styled from 'styled-components';

const ThemeList = styled(List)`
  padding-left: ${({ theme }) => theme.spacing(1)}px;
`;

export const ThemeSelection = () => {
  const { themeType, setTheme } = ThemeContainer.useContainer();
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
          <Palette />
        </ListItemIcon>
        <ListItemText primary="Themes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ThemeList disablePadding data-testid="themeList">
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
        </ThemeList>
      </Collapse>
    </>
  );
};
