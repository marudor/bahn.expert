import { createContainer } from 'unstated-next';
import { useCallback, useState } from 'react';

const defaultDescription =
  'Zugabfahrten für Stationen der Deutsche Bahn. Nutzt verschiedene Quellen um möglichst genaue Informationen bereitzustellen. Nutzt teilweise offizielle, teilweise inoffizielle Quellen.';
const defaultTitle = 'BahnhofsAbfahrten';

function useHeaderTag() {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);

  const updateTitle = useCallback((newTitle: string = defaultTitle) => {
    setTitle(newTitle);
  }, []);
  const updateDescription = useCallback(
    (newDescription: string = defaultDescription) => {
      setDescription(newDescription);
    },
    []
  );
  const resetTitleAndDescription = useCallback(() => {
    updateTitle();
    updateDescription();
  }, [updateDescription, updateTitle]);

  return {
    title,
    updateTitle,
    description,
    updateDescription,
    resetTitleAndDescription,
  };
}

const HeaderTagContainer = createContainer(useHeaderTag);

export default HeaderTagContainer;
