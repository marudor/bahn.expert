import { createContainer } from 'unstated-next';
import { setCookieOptions } from 'client/util';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetail = (initialSelected: string | undefined) => {
  const cookies = useCookies();
  const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
    initialSelected
  );

  const setSelectedDetail = useCallback(
    (newSelected?: string) => {
      let detailToSave: string | undefined;

      realSetSelectedDetail(oldSelectedDetail => {
        detailToSave =
          newSelected === oldSelectedDetail ? undefined : newSelected;

        return detailToSave;
      });
      if (detailToSave) {
        cookies.set(selectedDetailCookieName, detailToSave, setCookieOptions);
      } else {
        cookies.remove(selectedDetailCookieName);
      }
    },
    [cookies]
  );

  return {
    selectedDetail,
    setSelectedDetail,
  };
};

const SelectedDetailContainer = createContainer(useSelectedDetail);

export default SelectedDetailContainer;

type Props = {
  children: ReactNode;
};
export const SelectedDetailProvider = ({ children }: Props) => {
  const cookies = useCookies();
  const savedSelectedDetail = cookies.get(selectedDetailCookieName);

  return (
    <SelectedDetailContainer.Provider initialState={savedSelectedDetail}>
      {children}
    </SelectedDetailContainer.Provider>
  );
};
