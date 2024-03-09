import {
  Badge,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore, Palette } from '@mui/icons-material';
import { ThemeType } from '@/client/Themes/type';
import { useCallback, useState } from 'react';
import { useTheme } from '@/client/Common/provider/ThemeProvider';
import type { FC, SyntheticEvent } from 'react';

const ThemeList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

export const ThemeSelection: FC = () => {
  const { themeType, setThemeType } = useTheme();
  const [open, setOpen] = useState(false);
  const selectTheme = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const newThemeType = e.currentTarget.dataset.value as
        | undefined
        | E<typeof ThemeType>;

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
      <ListItemButton data-testid="themes" onClick={toggle}>
        <ListItemIcon>
          <Palette />
        </ListItemIcon>
        <ListItemText primary="Themes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <ThemeList disablePadding data-testid="themeList">
          {Object.values(ThemeType).map((themeOption: string) => {
            const name = themeOption[0].toUpperCase() + themeOption.slice(1);

            return (
              <ListItemButton
                key={themeOption}
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
              </ListItemButton>
            );
          })}
        </ThemeList>
      </Collapse>
    </>
  );
};
