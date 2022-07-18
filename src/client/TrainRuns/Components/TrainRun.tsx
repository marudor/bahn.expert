import { DetailsLink } from 'client/Common/Components/Details/DetailsLink';
import { format } from 'date-fns';
import type { FC } from 'react';
import type { TrainRunWithBR } from 'types/trainRuns';

interface Props {
  trainRun: TrainRunWithBR;
  selectedDate: Date;
}

export const TrainRun: FC<Props> = ({ trainRun, selectedDate }) => {
  const initialDeparture = new Date(selectedDate);
  initialDeparture.setHours(trainRun.origin.departureTime!.getHours());
  initialDeparture.setMinutes(trainRun.origin.departureTime!.getMinutes());
  return (
    <>
      <span>{trainRun.product.type}</span>
      <span>{trainRun.br?.name}</span>
      <span>{trainRun.product.number}</span>
      <span>{trainRun.product.line}</span>
      <span>
        {trainRun.origin.name} (
        {format(trainRun.origin.departureTime!, 'HH:mm')})
      </span>
      <span>
        {trainRun.destination.name} (
        {format(trainRun.destination.arrivalTime!, 'HH:mm')})
      </span>
      <span>
        <DetailsLink
          train={trainRun.product}
          initialDeparture={initialDeparture}
        />
      </span>
    </>
  );
};
