import { useCallback, useState } from 'react';
import constate from 'constate';
import type { PropsWithChildren } from 'react';

const defaultDescription =
  'Dein Begleiter um Stressfrei Bahn zu fahren. Sucht die besten Informationen aus allen Quellen um dich ans Ziel zu bringen.';
const defaultTitle = 'Bahn Experte';
const defaultKeywords = new Set([
  'marudor',
  'Bahn',
  'Experte',
  'Zugabfahrten',
  'Abfahrtstafel',
  'BahnhofsAbfahrten',
  'Zugabfahrtszeiten',
  'Verspätung',
  'Wagenreihung',
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
      setKeywords(new Set([...addedKeywords, ...defaultKeywords]));
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
