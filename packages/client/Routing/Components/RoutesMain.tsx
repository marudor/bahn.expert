import { format } from 'date-fns';
import { RouteList } from './RouteList';
import { Search } from './Search';
import { useEffect } from 'react';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useRoutingConfig } from 'client/Routing/provider/RoutingConfigProvider';
import styled from '@emotion/styled';
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
  });

  return null;
};

const Container = styled.main`
  margin-left: 0.5em;
  margin-right: 0.5em;
`;

export const RoutesMain: FC = () => {
  return (
    <Container>
      <RouteHeaderTags />
      <Search />
      <RouteList />
    </Container>
  );
};
