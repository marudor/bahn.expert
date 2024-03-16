/* eslint-disable unicorn/prefer-module */
import { AbfahrtContext } from '@/client/Abfahrten/Components/Abfahrt/BaseAbfahrt';
import { Auslastung } from '@/client/Abfahrten/Components/Abfahrt/Auslastung';
import { AuslastungsProvider } from '@/client/Abfahrten/provider/AuslastungsProvider';
import rawMockAbfahrt from '@/fixtures/mockAbfahrtAuslastung.json';
import type { Abfahrt } from '@/types/iris';

const mockAbfahrt = globalThis.parseJson<Abfahrt>(
  JSON.stringify(rawMockAbfahrt),
);

describe('Auslastung', () => {
  const renderAuslastung = () => {
    cy.mount(<Auslastung />, {
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
    return mockAbfahrt;
  };

  it('shows loading first, nothing on error', () => {
    cy.intercept(
      {
        url: encodeURI(
          `/api/hafas/v3/occupancy/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}/${
            mockAbfahrt.currentStopPlace.evaNumber
          }`,
        ),
      },
      {
        statusCode: 500,
        delay: 700,
      },
    );
    renderAuslastung();
    cy.findByTestId('auslastungDisplay').should('not.exist');
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('loading').should('not.exist');
    cy.findByTestId('auslastungDisplay').should('not.exist');
  });

  it('shows auslastung after loading', () => {
    cy.intercept(
      {
        url: encodeURI(
          `/api/hafas/v3/occupancy/${mockAbfahrt.currentStopPlace.name}/${
            mockAbfahrt.destination
          }/${
            mockAbfahrt.train.number
          }/${mockAbfahrt.departure!.scheduledTime.toISOString()}/${
            mockAbfahrt.currentStopPlace.evaNumber
          }`,
        ),
      },
      {
        statusCode: 200,
        body: {
          first: 1,
          second: 2,
        },
      },
    );

    renderAuslastung();
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('auslastungDisplay').should('exist');
  });
});
