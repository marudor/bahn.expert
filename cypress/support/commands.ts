import '@testing-library/cypress/add-commands';

Cypress.Commands.add(
  'navigateToStation',
  (
    value: string,
    {
      isStubbed = true,
      findPrefix,
    }: {
      isStubbed?: boolean;
      findPrefix?: string;
    } = {}
  ) => {
    if (!isStubbed) {
      cy.route(/\/api\/iris\/v1\/abfahrten.*/).as('irisAbfahrten');
    }
    const baseFind = findPrefix ? cy.findByTestId(findPrefix) : cy;

    baseFind.findByTestId('stationSearchInput').type(value);
    cy.findAllByTestId('stationSearchMenuItem')
      .first()
      .click();
    if (!isStubbed) {
      cy.wait('@irisAbfahrten');
    }
  }
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
  cy.route({
    url: `/api/iris/v1/abfahrten/${id}?lookahead=${lookahead}&lookbehind=${lookbehind}`,
    delay,
    response: `fixture:abfahrten${fixture}.json`,
  }).route(
    `/api/station/v1/search/${name}?type=default`,
    `fixture:stationSearch${fixture}.json`
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
  }
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
  }
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
  }
);

Cypress.Commands.add('getAbfahrtenConfig', () => {
  return cy
    .getCookie('config')
    .should('exist')
    .then(c => {
      if (!c) throw new Error("can' happen");
      const config = JSON.parse(decodeURIComponent(c.value));

      return cy.wrap(config);
    });
});

Cypress.Commands.add('openSettings', () => {
  cy.findByTestId('menu').click();
  cy.findByTestId('openSettings').click();
});
