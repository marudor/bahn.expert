import { isHbf } from 'client/Abfahrten/Components/Abfahrt/Via';
import { StationLink } from 'client/Common/Components/StationLink';
import { useAbfahrtenUrlPrefix } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useMemo } from 'react';
import { useStyles } from './Normal';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import type { Stop } from 'types/iris';

interface Props {
  stops: Stop[];
}
export const DetailVia: FC<Props> = ({ stops }) => {
  const classes = useStyles();
  const urlPrefix = useAbfahrtenUrlPrefix();

  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];

    stops.forEach((s, i) => {
      stopsToRender.push(
        <StationLink
          className={clsx(classes.main, {
            [classes.hbf]: isHbf(s),
            [classes.cancelled]: s.cancelled,
            [classes.additional]: s.additional,
          })}
          urlPrefix={urlPrefix}
          data-testid={`via-${s.name}`}
          key={i}
          stationName={s.name}
        />,
      );
      if (i + 1 !== stops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [classes, stops, urlPrefix]);

  return <>{stopsToRender}</>;
};
