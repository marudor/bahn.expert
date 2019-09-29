import { createContext, useCallback, useState } from 'react';
import { setCookieOptions } from 'client/util';
import useCookies from 'Common/useCookies';

const useSelectedDetail = () => {
  const cookies = useCookies();
  const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
    cookies.get('selectedDetail')
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
        cookies.set('selectedDetail', detailToSave, setCookieOptions);
      } else {
        cookies.remove('selectedDetail');
      }
    },
    [cookies]
  );

  return {
    selectedDetail,
    setSelectedDetail,
  };
};

// @ts-ignore
export const SelectedDetailContext = createContext<
  ReturnType<typeof useSelectedDetail>
>();

export default useSelectedDetail;
