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

    baseFind.findByTestId('stopPlaceSearchInput').type(value);
    cy.findAllByTestId('stopPlaceSearchMenuItem').first().click();
  },
);

Cypress.Commands.add('theme', (type: 'dark' | 'light' | 'black') => {
  cy.findByTestId('navToggle').click();
  cy.findByTestId('themes').click();
  cy.findByTestId('themeList').find(`[data-value="${type}"]`).click();
  cy.reload();
});

Cypress.Commands.add('closeModal', () => {
  cy.get('body').type('{esc}');
  cy.get('.MuiBackdrop-root').should('not.exist');
});

Cypress.Commands.add('percy', (name: string) => {
  cy.theme('dark');
  cy.percySnapshot(name);
});

function mockStopPlace({
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
      url: `/api/iris/v2/abfahrten/${id}?*`,
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
      url: `/api/stopPlace/v1/search/${encodeURIComponent(name)}?*`,
    },
    {
      fixture: `stopPlaceSearch${fixture}`,
    },
  );
}

Cypress.Commands.add(
  'mockFrankfurt',
  ({ lookbehind = 10, lookahead = 150, delay = 0 } = {}) => {
    mockStopPlace({
      lookahead,
      lookbehind,
      delay,
      name: 'Frankfurt (Main) Hbf',
      id: '8000105',
      fixture: 'FrankfurtHbf',
    });
  },
);

Cypress.Commands.add(
  'mockHamburg',
  ({ lookbehind = 10, lookahead = 150, delay = 0 } = {}) => {
    mockStopPlace({
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
  ({ lookbehind = 10, lookahead = 150, delay = 0 } = {}) => {
    mockStopPlace({
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
