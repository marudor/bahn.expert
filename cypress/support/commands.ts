import '@testing-library/cypress/add-commands';

Cypress.Commands.add('force404', () => {
  cy.intercept('/api/**', { statusCode: 404, body: 'unmocked disallowed' });
});

Cypress.Commands.add(
  'navigateToStation',
  (
    value: string,
    {
      findPrefix,
    }: {
      isStubbed?: boolean;
      findPrefix?: string;
    } = {},
  ) => {
    const baseFind = findPrefix ? cy.findByTestId(findPrefix) : cy;

    baseFind.findByTestId('stationSearchInput').type(value);
    cy.findAllByTestId('stationSearchMenuItem').first().click();
  },
);

Cypress.Commands.add('closeModal', () => {
  cy.get('.MuiBackdrop-root').click({ force: true });
});

function mockStation({
  lookbehind,
  lookahead,
  delay,
  name,
  fixture,
  id,
}: {
  lookbehind: number;
  lookahead: number;
  delay: number;
  name: string;
  fixture: string;
  id: string;
}) {
  cy.intercept(
    {
      url: `/api/iris/v2/abfahrten/${id}`,
      query: {
        lookahead: lookahead.toString(),
        lookbehind: lookbehind.toString(),
      },
    },
    {
      delayMs: delay,
      fixture: `abfahrten${fixture}`,
    },
  ).intercept(
    {
      url: `/api/station/v1/search/${encodeURIComponent(name)}`,
      query: {
        type: 'default',
      },
    },
    {
      fixture: `stationSearch${fixture}`,
    },
  );
}

Cypress.Commands.add(
  'mockFrankfurt',
  ({ lookbehind = 0, lookahead = 150, delay = 0 } = {}) => {
    mockStation({
      lookahead,
      lookbehind,
      delay,
      name: 'Frankfurt (Main) Hbf',
      id: '8098105',
      fixture: 'FrankfurtHbf',
    });
  },
);

Cypress.Commands.add(
  'mockHamburg',
  ({ lookbehind = 0, lookahead = 150, delay = 0 } = {}) => {
    mockStation({
      lookahead,
      lookbehind,
      delay,
      name: 'Hamburg Hbf',
      fixture: 'HamburgHbf',
      id: '8002549',
    });
  },
);

Cypress.Commands.add(
  'mockHannover',
  ({ lookbehind = 0, lookahead = 150, delay = 0 } = {}) => {
    mockStation({
      lookahead,
      lookbehind,
      delay,
      name: 'Hannover Hbf',
      fixture: 'HannoverHbf',
      id: '8000152',
    });
  },
);

Cypress.Commands.add('openSettings', () => {
  cy.findByTestId('menu').click();
  cy.findByTestId('openSettings').click();
});
