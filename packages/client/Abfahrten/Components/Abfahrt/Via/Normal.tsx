import { isHbf } from './index';
import { makeStyles } from '@material-ui/core';
import { ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import type { Stop } from 'types/iris';

export const useStyles = makeStyles((theme) => ({
  main: {
    color: theme.palette.text.primary,
  },
  hbf: {
    fontWeight: 'bold',
  },
  cancelled: {
    ...theme.mixins.cancelled,
    ...theme.mixins.changed,
  },
  additional: theme.mixins.additional,
}));

interface Props {
  stops: Stop[];
}
export const NormalVia = ({ stops }: Props) => {
  const classes = useStyles();
  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];
    const filteredStops = stops.filter((s) => s.showVia);

    filteredStops.forEach((s, i) => {
      stopsToRender.push(
        <span
          className={clsx(classes.main, {
            [classes.hbf]: isHbf(s),
            [classes.cancelled]: s.cancelled,
            [classes.additional]: s.additional,
          })}
          data-testid={`via-${s.name}`}
          key={i}
        >
          {s.name}
        </span>
      );
      if (i + 1 !== filteredStops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [stops, classes]);

  return <>{stopsToRender}</>;
};
