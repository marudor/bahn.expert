import { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { FC, PropsWithChildren } from 'react';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetailInternal = ({
  initialSelectedDetail,
}: PropsWithChildren<{
  initialSelectedDetail?: string;
}>) => {
  const storage = useStorage();
  const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
    initialSelectedDetail,
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
    [storage],
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
  (v) => v.setSelectedDetail,
);

export const SelectedDetailProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const storage = useStorage();
  const savedSelectedDetail = storage.get(selectedDetailCookieName);
  const hash = useLocation().hash?.substring(1);
  if (hash) {
    window.location.href = '';
    storage.set(selectedDetailCookieName, hash);
  }

  return (
    <InnerSelectedDetailProvider
      initialSelectedDetail={hash || savedSelectedDetail}
    >
      {children}
    </InnerSelectedDetailProvider>
  );
};
