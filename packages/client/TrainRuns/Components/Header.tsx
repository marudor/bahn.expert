import { BaseHeader } from 'client/Common/Components/BaseHeader';
import { de } from 'date-fns/locale';
import { format } from 'date-fns';
import { useEffect, useMemo } from 'react';
import { useHeaderTagsActions } from 'client/Common/provider/HeaderTagProvider';
import { useTrainRuns } from 'client/TrainRuns/provider/TrainRunProvider';
import type { FC } from 'react';

export const Header: FC = () => {
  const { selectedDate } = useTrainRuns();
  const { updateTitle } = useHeaderTagsActions();

  const title = useMemo(
    () =>
      `Beta Zugläufe (${format(selectedDate, 'eeee, dd.MM.yyyy', {
        locale: de,
      })})`,
    [selectedDate],
  );
  useEffect(() => updateTitle(title), [title]);
  return <BaseHeader>{title}</BaseHeader>;
};
