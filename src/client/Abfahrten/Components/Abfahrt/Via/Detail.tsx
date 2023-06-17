import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';
import { StyledViaStop } from './Normal';
import { useAbfahrtenUrlPrefix } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import type { Stop } from '@/types/iris';

const StyledStopPlaceLink = StyledViaStop.withComponent(StopPlaceLink);

interface Props {
  stops: Stop[];
}
export const DetailVia: FC<Props> = ({ stops }) => {
  const urlPrefix = useAbfahrtenUrlPrefix();

  const stopsToRender = useMemo(() => {
    const result: ReactNode[] = [];

    for (const [i, s] of stops.entries()) {
      result.push(
        <StyledStopPlaceLink
          stop={s}
          urlPrefix={urlPrefix}
          data-testid={`via-${s.name}`}
          key={i}
          stopPlace={{
            name: s.name,
          }}
        />,
      );
      if (i + 1 !== stops.length) {
        result.push(' - ');
      }
    }

    return result;
  }, [stops, urlPrefix]);

  return <>{stopsToRender}</>;
};
