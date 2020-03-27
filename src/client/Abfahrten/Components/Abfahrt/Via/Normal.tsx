import { isHbf } from './index';
import { Train } from 'types/iris';
import cc from 'clsx';
import React, { ReactNode, useMemo } from 'react';
import useStyles from './index.style';

interface Props {
  stops: Train[];
}
const NormalVia = ({ stops }: Props) => {
  const classes = useStyles();
  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];
    const filteredStops = stops.filter((s) => s.showVia);

    filteredStops.forEach((s, i) => {
      stopsToRender.push(
        <span
          data-testid={`via-${s.name}`}
          key={i}
          className={cc({
            [classes.cancelled]: s.cancelled,
            [classes.additional]: s.additional,
            [classes.hbf]: isHbf(s),
          })}
        >
          {s.name}
        </span>
      );
      if (i + 1 !== filteredStops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [classes, stops]);

  return <>{stopsToRender}</>;
};

export default NormalVia;
