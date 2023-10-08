import { format } from 'date-fns';
import { Header } from './Header';
import { StopList } from './StopList';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import { useEffect } from 'react';
import { useHeaderTagsActions } from '@/client/Common/provider/HeaderTagProvider';
import loadable from '@loadable/component';
import type { FC } from 'react';

const LazyMapDisplay = loadable(() => import('./MapDisplay'), {
  ssr: false,
});

export const Details: FC = () => {
  const { updateTitle, updateDescription, updateKeywords } =
    useHeaderTagsActions();
  const { initialDepartureDate, details, trainName, isMapDisplay } =
    useDetails();

  useEffect(() => {
    if (details) {
      updateTitle(
        `${details.train.name} @ ${format(
          details.departure.time,
          'dd.MM.yyyy',
        )}`,
      );
      updateKeywords([details.train.name]);
    } else {
      updateTitle(trainName);
    }
    let description = `Details zu ${trainName}`;

    if (initialDepartureDate) {
      description += ` am ${format(initialDepartureDate, 'dd.MM.yyyy')}`;
    }
    updateDescription(description);
  }, [
    details,
    initialDepartureDate,
    trainName,
    updateDescription,
    updateTitle,
    updateKeywords,
  ]);

  return (
    <>
      <Header />
      {isMapDisplay ? <LazyMapDisplay /> : <StopList />}
    </>
  );
};
