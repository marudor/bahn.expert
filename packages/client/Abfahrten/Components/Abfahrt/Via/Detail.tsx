import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import { ReactNode, useMemo } from 'react';
import { StationLink } from 'client/Common/Components/StationLink';
import { ViaStop } from './Normal';
import type { Stop } from 'types/iris';

const DetailViaStop = ViaStop.withComponent(StationLink);

interface Props {
  stops: Stop[];
}
export const DetailVia = ({ stops }: Props) => {
  const urlPrefix = AbfahrtenConfigContainer.useContainer().urlPrefix;

  const stopsToRender = useMemo(() => {
    const stopsToRender: ReactNode[] = [];

    stops.forEach((s, i) => {
      stopsToRender.push(
        <DetailViaStop
          urlPrefix={urlPrefix}
          data-testid={`via-${s.name}`}
          key={i}
          stationName={s.name}
          stop={s}
        />
      );
      if (i + 1 !== stops.length) {
        stopsToRender.push(' - ');
      }
    });

    return stopsToRender;
  }, [stops, urlPrefix]);

  return <>{stopsToRender}</>;
};
