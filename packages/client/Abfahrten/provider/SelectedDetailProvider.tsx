import { ReactNode, useCallback, useState } from 'react';
import { useWebStorage } from 'client/useWebStorage';
import constate from 'constate';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetailInternal = ({
  initialSelectedDetail,
}: {
  initialSelectedDetail?: string;
}) => {
  const storage = useWebStorage();
  const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
    initialSelectedDetail
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

export const [
  InnerSelectedDetailProvider,
  useSelectedDetail,
  useSetSelectedDetail,
] = constate(
  useSelectedDetailInternal,
  (v) => v.selectedDetail,
  (v) => v.setSelectedDetail
);

interface Props {
  children: ReactNode;
}
export const SelectedDetailProvider = ({ children }: Props) => {
  const storage = useWebStorage();
  const savedSelectedDetail = storage.get(selectedDetailCookieName);

  return (
    <InnerSelectedDetailProvider initialSelectedDetail={savedSelectedDetail}>
      {children}
    </InnerSelectedDetailProvider>
  );
};
