import { createContainer } from 'unstated-next';
import React, { ReactNode, useCallback, useState } from 'react';
import useStorage from 'shared/hooks/useStorage';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetail = (initialSelected: string | undefined) => {
  const storage = useStorage();
  const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
    initialSelected
  );

  const setSelectedDetail = useCallback(
    (newSelected?: string) => {
      realSetSelectedDetail((oldSelectedDetail) => {
        const detailToSave =
          newSelected === oldSelectedDetail ? undefined : newSelected;

        if (detailToSave) {
          storage.set(selectedDetailCookieName, detailToSave);
        } else {
          storage.remove(selectedDetailCookieName);
        }

        return detailToSave;
      });
    },
    [storage]
  );

  return {
    selectedDetail,
    setSelectedDetail,
  };
};

const SelectedDetailContainer = createContainer(useSelectedDetail);

export default SelectedDetailContainer;

interface Props {
  children: ReactNode;
}
export const SelectedDetailProvider = ({ children }: Props) => {
  const storage = useStorage();
  const savedSelectedDetail = storage.get(selectedDetailCookieName);

  return (
    <SelectedDetailContainer.Provider initialState={savedSelectedDetail}>
      {children}
    </SelectedDetailContainer.Provider>
  );
};
