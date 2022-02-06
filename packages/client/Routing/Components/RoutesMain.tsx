import { format } from 'date-fns';
import { RouteList } from './RouteList';
import { Search } from './Search';
import { useEffect } from 'react';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useRoutingConfig } from 'client/Routing/provider/RoutingConfigProvider';
import type { FC } from 'react';

const RouteHeaderTags = () => {
  const { updateTitle, updateDescription } = useHeaderTagsActions();
  const { start, destination, via, date } = useRoutingConfig();

  useEffect(() => {
    if (!start && !destination) {
      updateTitle();
      updateDescription();
    } else {
      updateTitle(
        `${start?.name ?? '?'} -> ${destination?.name ?? '?'} @ ${format(
          date || Date.now(),
          'HH:mm dd.MM.yy',
        )}`,
      );
      const viaString = `-> ${via.map((v) => `${v.name} -> `)}`;

      updateDescription(
        `${start?.name ?? '?'} ${viaString}${
          destination?.name ?? '?'
        } @ ${format(date || Date.now(), 'HH:mm dd.MM.yy')}`,
      );
    }
  }, [start, destination, via, date]);

  return null;
};

export const RoutesMain: FC = () => {
  return (
    <main>
      <RouteHeaderTags />
      <Search />
      <RouteList />
    </main>
  );
};
