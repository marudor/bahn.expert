import { setCookieOptions } from 'client/util';
import { useCallback, useState } from 'react';
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

export default useSelectedDetail;
