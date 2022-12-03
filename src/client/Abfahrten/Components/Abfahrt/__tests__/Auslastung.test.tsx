/* eslint-disable unicorn/prefer-module */
import { AbfahrtContext } from 'client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { Auslastung } from 'client/Abfahrten/Components/Abfahrt/Auslastung';
import { AuslastungsProvider } from 'client/Abfahrten/provider/AuslastungsProvider';
import { render } from 'client/__tests__/testHelper';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import type { Abfahrt } from 'types/iris';

const mockAbfahrt: Abfahrt = globalThis.parseJson(
  fs.readFileSync(
    path.resolve(__dirname, '__fixtures__/mockAbfahrt.json'),
    'utf8',
  ),
);

describe('Auslastung', () => {
  const renderAuslastung = () =>
    render(<Auslastung />, {
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
          `/api/hafas/v3/occupancy/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}/${
            mockAbfahrt.currentStopPlace.evaNumber
          }`,
        ),
      )
      .reply(500);
    renderAuslastung();

    await waitForElementToBeRemoved(() => screen.queryByTestId('loading'));
    expect(screen.queryByTestId('auslastungDisplay')).toBeNull();
  });

  it('shows auslastung after loading', async () => {
    nock
      .get(
        encodeURI(
          `/api/hafas/v3/occupancy/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}/${
            mockAbfahrt.currentStopPlace.evaNumber
          }`,
        ),
      )
      .reply(200, {
        first: 1,
        second: 2,
      });

    renderAuslastung();

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await screen.findByTestId('auslastungDisplay');
  });
});
