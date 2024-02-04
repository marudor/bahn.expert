import {
  AvailableBRConstant,
  AvailableIdentifierConstant,
} from '@/types/coachSequence';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { Disclaimer } from '@/client/TrainRuns/Components/TrainRunFilter/Disclaimer';
import { Info } from '@mui/icons-material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useCallback, useEffect, useState } from 'react';
import { useTrainRuns } from '@/client/TrainRuns/provider/TrainRunProvider';
import styled from '@emotion/styled';
import type {
  AvailableBR,
  AvailableIdentifierOnly,
} from '@/types/coachSequence';
import type { FC } from 'react';
import type { SelectChangeEvent } from '@mui/material';

const FilterContainer = styled(Stack)`
  flex-direction: row;
  margin-top: 1em;
  justify-content: space-between;
  & > .MuiFormControl-root {
    flex: 1;
    margin-left: 0.5em;
    margin-right: 0.5em;
  }
`;

const ButtonContainer = styled(Stack)`
  flex-direction: row;
  > button {
    margin-left: 0.5em;
  }
`;

export const TrainRunFilter: FC = () => {
  const { selectedDate, fetchTrainRuns } = useTrainRuns();
  const [date, setDate] = useState(selectedDate);
  const [baureihen, setBaureihen] = useState<AvailableBR[]>([]);
  const [identifier, setIdentifier] = useState<AvailableIdentifierOnly[]>([]);

  const resetFilter = useCallback(() => {
    setBaureihen([]);
    setIdentifier([]);
  }, []);

  const handleBaureihenChange = useCallback(
    (e: SelectChangeEvent<string | string[]>) => {
      const {
        target: { value },
      } = e;
      // @ts-expect-error this works
      setBaureihen(typeof value === 'string' ? value.split(',') : value);
    },
    [],
  );

  const handleIdentifierChange = useCallback(
    (e: SelectChangeEvent<string | string[]>) => {
      const {
        target: { value },
      } = e;
      // @ts-expect-error this works
      setIdentifier(typeof value === 'string' ? value.split(',') : value);
    },
    [],
  );

  const update = useCallback(
    () => fetchTrainRuns(date, baureihen, identifier),
    [date, baureihen, identifier, fetchTrainRuns],
  );

  useEffect(() => {
    void update();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <FilterContainer>
        <MobileDatePicker
          slots={{
            textField: (props) => (
              <TextField
                {...props}
                label="Datum"
                inputProps={{
                  ...props.inputProps,
                  'data-testid': 'trainRunsDatePicker',
                }}
              />
            ),
          }}
          closeOnSelect
          value={date}
          onChange={setDate as any}
        />
        <FormControl>
          <InputLabel id="brLabel">Baureihen</InputLabel>
          <Select
            labelId="brLabel"
            value={baureihen}
            multiple
            onChange={handleBaureihenChange}
          >
            {AvailableBRConstant.map((br) => (
              <MenuItem key={br} value={br}>
                {br}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="identifierLabel">Identifier</InputLabel>
          <Select
            labelId="identifierLabel"
            value={identifier}
            multiple
            onChange={handleIdentifierChange}
          >
            {AvailableIdentifierConstant.map((br) => (
              <MenuItem key={br} value={br}>
                {br}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterContainer>
      <ButtonContainer>
        <Button variant="outlined" onClick={update}>
          Suchen
        </Button>
        <Button color="warning" variant="outlined" onClick={resetFilter}>
          Reset BR/Identifier
        </Button>
        <Disclaimer>
          {(toggleModal) => (
            <Button color="info" variant="outlined" onClick={toggleModal}>
              Informationen
              <Info />
            </Button>
          )}
        </Disclaimer>
      </ButtonContainer>
      <hr />
    </div>
  );
};
