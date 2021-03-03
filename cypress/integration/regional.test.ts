describe('Regional', () => {
  it('can navigate to Details Page', () => {
    cy.server();
    cy.route(
      '/api/hafas/v1/station/Poststraße, Karlsruhe?profile=db&type=S',
      'fixture:regional/stationSearchPoststrasse',
    );
    cy.route(
      '/api/hafas/v1/station/Poststraße, Karlsruhe?type=S',
      'fixture:regional/stationSearchPoststrasse',
    );
    cy.route(
      '/api/hafas/experimental/irisCompatibleAbfahrten/000723869?lookahead=150&lookbehind=0',
      'fixture:regional/departurePostStrasse.json',
    );
    cy.route(
      '/api/hafas/v2/details/STR 1761?station=723870&date=2020-05-02T17:54:00.000Z',
      'fixture:regional/detailsStr1761.json',
    );
    cy.route(
      '/api/hafas/v1/station/Arndt-/Spittastraße, Stuttgart?profile=db&type=S',
      'fixture:regional/stationSearchArndtSpittastrasse.json',
    );
    cy.route(
      '/api/hafas/v1/station/Arndt-/Spittastraße, Stuttgart?type=S',
      'fixture:regional/stationSearchArndtSpittastrasse.json',
    );
    cy.route(
      '/api/hafas/experimental/irisCompatibleAbfahrten/000559177?lookahead=150&lookbehind=0',
      'fixture:regional/departureArndtSpittastrasse.json',
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
        '/regional/Karlsruhe%20Bahnhofsvorplatz',
      );
    });
    cy.visit('/');
    cy.findByTestId('navToggle').click();
    cy.findByTestId('regional').click();
    cy.navigateToStation('Arndt-/Spittastraße, Stuttgart');
    cy.findByTestId('abfahrtSTB77629');
  });
});
