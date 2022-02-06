import type {
  CoachSequenceBaureihe,
  CoachSequenceProduct,
} from 'types/coachSequence';
import type { MinimalStopPlace } from 'types/stopPlace';

export interface TrainRunStop extends MinimalStopPlace {
  arrivalTime?: Date;
  departureTime?: Date;
}

export interface TrainRun {
  product: CoachSequenceProduct;
  origin: TrainRunStop;
  destination: TrainRunStop;
  via: TrainRunStop[];
  primaryVehicleGroupName: string;
  dates: Date[];
}

export interface TrainRunWithBR
  extends Omit<TrainRun, 'primaryVehicleGroupName'> {
  br?: CoachSequenceBaureihe;
}
