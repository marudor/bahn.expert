import { createContainer } from 'unstated-next';
import { ReactNode, useCallback, useState } from 'react';
import { useWebStorage } from 'client/useWebStorage';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetail = (initialSelected: string | undefined) => {
  const storage = useWebStorage();
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

export const SelectedDetailContainer = createContainer(useSelectedDetail);

interface Props {
  children: ReactNode;
}
export const SelectedDetailProvider = ({ children }: Props) => {
  const storage = useWebStorage();
  const savedSelectedDetail = storage.get(selectedDetailCookieName);

  return (
    <SelectedDetailContainer.Provider initialState={savedSelectedDetail}>
      {children}
    </SelectedDetailContainer.Provider>
  );
};
