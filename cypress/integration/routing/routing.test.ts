describe('Routing', () => {
  beforeEach(() => {
    cy.intercept(
      `/api/hafas/v1/station/${encodeURIComponent('Frankfurt Hbf')}`,
      { fixture: 'stationSearchFrankfurtHbf' },
    );
    cy.intercept(`/api/hafas/v1/station/${encodeURIComponent('Hamburg Hbf')}`, {
      fixture: 'stationSearchHamburgHbf',
    });
  });
  describe('Favorites', () => {
    it('Initially no favs', () => {
      cy.force404();
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry').should('not.exist');
    });

    it('Can save fav, is saved on reload', () => {
      cy.force404();
      cy.visit('/routing');
      cy.navigateToStation('Frankfurt Hbf', {
        findPrefix: 'routingStartSearch',
      });
      cy.navigateToStation('Hamburg Hbf', {
        findPrefix: 'routingDestinationSearch',
      });
      cy.findByTestId('routingFavButton').click();
      cy.findByTestId('RouteFavEntry-80981058002549db').should('exist');
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80981058002549db').should('exist');
    });
  });
});
