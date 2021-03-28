import { AbfahrtContext } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { AuslastungsProvider } from 'client/Abfahrten/provider/AuslastungsProvider';
import { render } from 'client/__tests__/testHelper';
import { waitForElementToBeRemoved } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import type { Abfahrt } from 'types/iris';

const mockAbfahrt: Abfahrt = global.parseJson(
  fs.readFileSync(
    path.resolve(__dirname, '__fixtures__/mockAbfahrt.json'),
    'utf8',
  ),
);

describe('Auslastung', () => {
  const renderAuslastung = () =>
    render(Auslastung, undefined, {
      provider: [
        {
          Provider: AuslastungsProvider,
        },
      ],
      context: [
        {
          ...AbfahrtContext,
          initialState: { abfahrt: mockAbfahrt, detail: false },
        },
      ],
    });

  it('shows loading first, nothing on error', async () => {
    nock
      .get(
        encodeURI(
          `/api/hafas/v2/auslastung/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}`,
        ),
      )
      .reply(500);
    const { queryByTestId } = renderAuslastung();

    await waitForElementToBeRemoved(() => queryByTestId('loading'));
    expect(queryByTestId('auslastungDisplay')).toBeNull();
  });

  it('shows auslastung after loading', async () => {
    nock
      .get(
        encodeURI(
          `/api/hafas/v2/auslastung/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}`,
        ),
      )
      .reply(200, {
        first: 1,
        second: 2,
      });

    const { getByTestId, findByTestId } = renderAuslastung();

    expect(getByTestId('loading')).toBeInTheDocument();
    await findByTestId('auslastungDisplay');
  });
});
