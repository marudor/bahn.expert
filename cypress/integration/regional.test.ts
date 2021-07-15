describe('Regional', () => {
  it('can navigate to Details Page', () => {
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent(
        'Poststraße, Karlsruhe',
      )}?*`,
      {
        fixture: 'regional/stopPlaceSearchPoststrasse',
      },
    );
    cy.intercept(
      {
        url: '/api/hafas/experimental/irisCompatibleAbfahrten/0723869?*',
        query: {
          lookahead: '150',
          lookbehind: '0',
        },
      },
      { fixture: 'regional/departurePostStrasse' },
    );
    cy.intercept(
      {
        url: `/api/hafas/v2/details/${encodeURIComponent('STR 1761')}?*`,
        query: {
          station: '723870',
          date: '2020-05-02T17:54:00.000Z',
        },
      },
      { fixture: 'regional/detailsStr1761' },
    );
    cy.visit('/');
    cy.findByTestId('navToggle').click();
    cy.findByTestId('regional').click();
    cy.navigateToStation('Poststraße, Karlsruhe');
    cy.findByTestId('abfahrtSTR1761').click();
    cy.findByTestId('abfahrtSTR1761').findByTestId('detailsLink').click();
    cy.findByTestId('8079041').within(() => {
      cy.get('a').should(
        'have.attr',
        'href',
        '/regional/Karlsruhe Bahnhofsvorplatz',
      );
    });
  });

  it('can handle slashes', () => {
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent(
        'Arndt-/Spittastraße, Stuttgart',
      )}?*`,
      { fixture: 'regional/stopPlaceSearchArndtSpittastrasse' },
    );
    cy.intercept(
      {
        url: '/api/hafas/experimental/irisCompatibleAbfahrten/0369218?*',
        query: {
          lookahead: '150',
          lookbehind: '0',
        },
      },
      { fixture: 'regional/departureArndtSpittastrasse' },
    );
    cy.visit('/');
    cy.findByTestId('navToggle').click();
    cy.findByTestId('regional').click();
    cy.navigateToStation('Arndt-/Spittastraße, Stuttgart');
    cy.findByTestId('abfahrtSTB77629');
  });
});
