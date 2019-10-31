import { render } from 'testHelper';
import { wait, waitForElementToBeRemoved } from '@testing-library/react';
import Auslastung from 'Abfahrten/Components/Abfahrt/Auslastung';
import AuslastungContainer from 'Abfahrten/container/AuslastungContainer';
import mockAbfahrt from './__fixtures__/mockAbfahrt.json';

describe('Auslastung', () => {
  const renderAuslastung = () =>
    render(
      Auslastung,
      { abfahrt: mockAbfahrt },
      { container: [AuslastungContainer] }
    );

  it('shows loading first, nothing on error', async () => {
    const { queryByTestId } = renderAuslastung();

    await waitForElementToBeRemoved(() => queryByTestId('loading'));
    expect(queryByTestId('auslastungDisplay')).toBeNull();
  });

  it('shows auslastung after loading', async () => {
    nock
      .get(
        `/api/hafas/v1/auslastung/${mockAbfahrt.currentStation.title}/${mockAbfahrt.destination}/${mockAbfahrt.train.number}/${mockAbfahrt.departure.scheduledTime}`
      )
      .reply(200, {
        first: 1,
        second: 2,
      });

    const { getByTestId } = renderAuslastung();

    getByTestId('loading');
    await wait(() => getByTestId('auslastungDisplay'));
  });
});
