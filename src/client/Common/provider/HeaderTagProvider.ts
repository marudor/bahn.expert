import { useCallback, useState } from 'react';
import constate from 'constate';
import type { PropsWithChildren } from 'react';

const defaultDescription =
  'Zugabfahrten für Stationen der Deutsche Bahn. Nutzt verschiedene Quellen um möglichst genaue Informationen bereitzustellen. Nutzt teilweise offizielle, teilweise inoffizielle Quellen.';
const defaultTitle = 'BahnhofsAbfahrten';

function useHeaderTagInner(_p: PropsWithChildren<unknown>) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);

  const updateTitle = useCallback((newTitle: string = defaultTitle) => {
    setTitle(newTitle);
  }, []);
  const updateDescription = useCallback(
    (newDescription: string = defaultDescription) => {
      setDescription(newDescription);
    },
    [],
  );

  return {
    values: {
      title,
      description,
    },
    actions: {
      updateTitle,
      updateDescription,
    },
  };
}

export const [HeaderTagProvider, useHeaderTags, useHeaderTagsActions] =
  constate(
    useHeaderTagInner,
    (v) => v.values,
    (v) => v.actions,
  );
