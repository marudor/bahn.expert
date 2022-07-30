import { useCallback, useState } from 'react';
import constate from 'constate';
import type { PropsWithChildren } from 'react';

const defaultDescription =
  'Zugabfahrten für Stationen der Deutsche Bahn. Nutzt verschiedene Quellen um möglichst genaue Informationen bereitzustellen.';
const defaultTitle = 'BahnhofsAbfahrten';
const defaultKeywords = new Set([
  'Zugabfahrten',
  'BahnhofsAbfahrten',
  'Zugabfahrtszeiten',
  'Verspätung',
  'Wagenreihung',
  'Reihung',
  'ICE',
  'Fernverkehr',
  'Regionalverkehr',
]);

function useHeaderTagInner(_p: PropsWithChildren<unknown>) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [keywords, setKeywords] = useState(defaultKeywords);

  const updateTitle = useCallback((newTitle: string = defaultTitle) => {
    setTitle(newTitle);
  }, []);
  const updateDescription = useCallback(
    (newDescription: string = defaultDescription) => {
      setDescription(newDescription);
    },
    [],
  );
  const updateKeywords = useCallback((addedKeywords?: string[]) => {
    if (addedKeywords) {
      setKeywords(new Set([...defaultKeywords, ...addedKeywords]));
    } else {
      setKeywords(defaultKeywords);
    }
  }, []);

  return {
    values: {
      title,
      description,
      keywords,
    },
    actions: {
      updateTitle,
      updateDescription,
      updateKeywords,
    },
  };
}

export const [HeaderTagProvider, useHeaderTags, useHeaderTagsActions] =
  constate(
    useHeaderTagInner,
    (v) => v.values,
    (v) => v.actions,
  );
