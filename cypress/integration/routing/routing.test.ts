describe('Routing', () => {
  beforeEach(() => {
    cy.route(
      '/api/hafas/v1/station/Frankfurt Hbf?profile=db&type=S',
      'fixture:stationSearchFrankfurtHbf.json'
    );
    cy.route(
      '/api/hafas/v1/station/Hamburg Hbf?profile=db&type=S',
      'fixture:stationSearchHamburgHbf.json'
    );
  });
  describe('Favorites', () => {
    it('Initially no favs', () => {
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry').should('not.exist');
    });

    it('Can save fav, is saved on reload', () => {
      cy.route(
        '/api/hafas/v1/station/Frankfurt Hbf?profile=db&type=S',
        'fixture:stationSearchFrankfurtHbf.json'
      );
      cy.route(
        '/api/hafas/v1/station/Hamburg Hbf?profile=db&type=S',
        'fixture:stationSearchHamburgHbf.json'
      );
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

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Changes profile only for Fav', () => {
      cy.route(
        '/api/hafas/v1/station/8098105?profile=db&type=S',
        'fixture:stationSearchFrankfurtHbf.json'
      );
      cy.route(
        '/api/hafas/v1/station/8002549?profile=db&type=S',
        'fixture:stationSearchHamburgHbf.json'
      );
      cy.route({
        method: 'POST',
        url: '/api/hafas/v2/tripSearch?profile=db',
        response: 'fixture:routing/FFMToHH.json',
      }).as('RouteSearchDB');

      // Set up Favorite
      cy.visit('/routing');
      cy.navigateToStation('Frankfurt Hbf', {
        findPrefix: 'routingStartSearch',
      });
      cy.navigateToStation('Hamburg Hbf', {
        findPrefix: 'routingDestinationSearch',
      });
      cy.findByTestId('routingFavButton').click();
      cy.setCookie('hafasProfile', 'oebb');
      // Call Favorite
      cy.visit('/routing');
      cy.findByTestId('routingSettingsPanel').click();
      cy.findByTestId('routingHafasProfile').should('have.value', 'oebb');
      cy.findByTestId('RouteFavEntry-80981058002549db').click();
      cy.wait('@RouteSearchDB');
      cy.findByTestId('Route-C-0').should('exist');
      // Use Fetch Earlier to check if currently correct profile is used
      cy.findByTestId('fetchCtxEarly').click();
      cy.wait('@RouteSearchDB');
      cy.findByTestId('fetchCtxEarly').should('exist');
      // Swap start & destination
      cy.findByTestId('swapStations').click();
      cy.findByTestId('routingStartSearch')
        .findByTestId('stationSearchInput')
        .should('have.value', 'Hamburg Hbf');
      cy.findByTestId('routingDestinationSearch')
        .findByTestId('stationSearchInput')
        .should('have.value', 'Frankfurt (Main) Hbf');
      // Search with saved Profile -> OEBB
      cy.route(
        '/api/hafas/v1/station/8098105?profile=oebb',
        'fixture:stationSearchFrankfurtHbf.json'
      );
      cy.route(
        '/api/hafas/v1/station/8002549?profile=oebb',
        'fixture:stationSearchHamburgHbf.json'
      );
      cy.route({
        method: 'POST',
        url: '/api/hafas/v2/tripSearch?profile=oebb',
        response: 'fixture:routing/HHToFFM.json',
      });
      cy.findByTestId('search').click();
      cy.findByTestId('Route-C-0-OEBB').should('exist');
    });
  });
});
