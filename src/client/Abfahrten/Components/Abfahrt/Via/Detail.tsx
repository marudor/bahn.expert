import { isHbf } from './index';
import { Train } from 'types/iris';
import cc from 'clsx';
import React, { ReactNode, useMemo } from 'react';
import StationLink from 'Common/Components/StationLink';
import useStyles from './index.style';

interface Props {
  stops: Train[];
}
const DetailVia = ({ stops }: Props) => {
  const classes = useStyles();

  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];

    stops.forEach((s, i) => {
      stopsToRender.push(
        <StationLink
          data-testid={`via-${s.name}`}
          key={i}
          stationName={s.name}
          className={cc({
            [classes.cancelled]: s.cancelled,
            [classes.additional]: s.additional,
            [classes.hbf]: isHbf(s),
          })}
        />
      );
      if (i + 1 !== stops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [classes, stops]);

  return <>{stopsToRender}</>;
};

export default DetailVia;
