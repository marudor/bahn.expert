/* eslint-disable unicorn/prefer-module */
import { TravelynxLink } from '@/client/Common/Components/CheckInLink/TravelynxLink';
import rawMockAbfahrt from '@/fixtures/abfahrtCheckin.json';
import type { Abfahrt } from '@/types/iris';

const mockAbfahrt = globalThis.parseJson<Abfahrt>(
  JSON.stringify(rawMockAbfahrt),
);

describe('Travellynx', () => {
  it('Renders Travellynx if arrival in 20 Minutes', () => {
    cy.clock(new Date('2019-07-22T14:19:00.000Z'));

    cy.mount(
      <TravelynxLink
        arrival={mockAbfahrt.arrival}
        departure={mockAbfahrt.departure}
        evaNumber={mockAbfahrt.currentStopPlace.evaNumber}
        train={mockAbfahrt.train}
      />,
    );

    cy.findByTestId('travellynxlink').should('exist');
  });
  it('Renders Travellynx if departure in 20 Minutes and arrival not existant', () => {
    cy.clock(new Date('2019-07-22T14:19:00.000Z'));

    cy.mount(
      <TravelynxLink
        departure={mockAbfahrt.departure}
        evaNumber={mockAbfahrt.currentStopPlace.evaNumber}
        train={mockAbfahrt.train}
      />,
    );
    cy.findByTestId('travellynxlink').should('exist');
  });
  it('Renders no link if arrival >30 Minutes away', () => {
    cy.clock(new Date('2019-07-22T14:08:00.000Z'));

    cy.mount(
      <TravelynxLink
        arrival={mockAbfahrt.arrival}
        departure={mockAbfahrt.departure}
        evaNumber={mockAbfahrt.currentStopPlace.evaNumber}
        train={mockAbfahrt.train}
      />,
    );
    cy.findByTestId('travellynxlink').should('not.exist');
  });
  it('Renders link if arrival >30 Minutes but planned arrival <30', () => {
    cy.clock(new Date('2019-07-22T14:19:00.000Z'));

    cy.mount(
      <TravelynxLink
        departure={mockAbfahrt.departure}
        evaNumber={mockAbfahrt.currentStopPlace.evaNumber}
        train={mockAbfahrt.train}
        arrival={{
          ...mockAbfahrt.arrival!,
          time: new Date('2019-07-22T17:52:00.000Z'),
        }}
      />,
    );

    cy.findByTestId('travellynxlink').should('exist');
  });
});
