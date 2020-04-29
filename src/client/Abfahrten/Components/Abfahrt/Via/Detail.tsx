import { isHbf } from './index';
import { ReactNode, useMemo } from 'react';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import cc from 'clsx';
import StationLink from 'Common/Components/StationLink';
import useStyles from './index.style';
import type { Train } from 'types/iris';

interface Props {
  stops: Train[];
}
const DetailVia = ({ stops }: Props) => {
  const urlPrefix = AbfahrtenConfigContainer.useContainer().urlPrefix;
  const classes = useStyles();

  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];

    stops.forEach((s, i) => {
      stopsToRender.push(
        <StationLink
          urlPrefix={urlPrefix}
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
  }, [classes, stops, urlPrefix]);

  return <>{stopsToRender}</>;
};

export default DetailVia;
