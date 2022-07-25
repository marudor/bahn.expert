import { StationLink } from 'client/Common/Components/StationLink';
import { StyledViaStop } from './Normal';
import { useAbfahrtenUrlPrefix } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import type { Stop } from 'types/iris';

const StyledStationLink = StyledViaStop.withComponent(StationLink);

interface Props {
  stops: Stop[];
}
export const DetailVia: FC<Props> = ({ stops }) => {
  const urlPrefix = useAbfahrtenUrlPrefix();

  const stopsToRender = useMemo(() => {
    const result: ReactNode[] = [];

    stops.forEach((s, i) => {
      result.push(
        <StyledStationLink
          stop={s}
          urlPrefix={urlPrefix}
          data-testid={`via-${s.name}`}
          key={i}
          stationName={s.name}
        />,
      );
      if (i + 1 !== stops.length) {
        result.push(' - ');
      }
    });

    return result;
  }, [stops, urlPrefix]);

  return <>{stopsToRender}</>;
};
