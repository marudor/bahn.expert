describe('Routing', () => {
  beforeEach(() => {
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent('Frankfurt Hbf')}`,
      { fixture: 'stopPlaceSearchFrankfurtHbf' },
    );
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent('Hamburg Hbf')}`,
      {
        fixture: 'stopPlaceSearchHamburgHbf',
      },
    );
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
      cy.findByTestId('RouteFavEntry-80001058002549').should('exist');
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001058002549').should('exist');
    });

    const oldFavCookie =
      '%7B%22008000191008000105db%22%3A%7B%22start%22%3A%7B%22title%22%3A%22Karlsruhe%20Hbf%22%2C%22id%22%3A%22008000191%22%7D%2C%22destination%22%3A%7B%22title%22%3A%22Frankfurt(Main)Hbf%22%2C%22id%22%3A%22008000105%22%7D%2C%22via%22%3A%5B%5D%2C%22profile%22%3A%22db%22%7D%7D';

    const favCookie =
      '%7B%22008000191008000105db%22%3A%7B%22start%22%3A%7B%22name%22%3A%22Karlsruhe%20Hbf%22%2C%22evaNumber%22%3A%228000191%22%7D%2C%22destination%22%3A%7B%22name%22%3A%22Frankfurt(Main)Hbf%22%2C%22evaNumber%22%3A%228000105%22%7D%2C%22via%22%3A%5B%5D%7D%7D';

    it('can load fav from cookie (old format)', () => {
      cy.force404();
      cy.setCookie('rfavs', oldFavCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
      cy.getCookie('rfavs').should('have.property', 'value', favCookie);
    });

    it('can load fav from cookie', () => {
      cy.force404();
      cy.setCookie('rfavs', favCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
    });

    it('can delete fav', () => {
      cy.force404();
      cy.setCookie('rfavs', favCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
      cy.findByTestId('RouteFavEntry-80001918000105').within(() => {
        cy.findByTestId('deleteFav').click();
      });
      cy.findByTestId('RouteFavEntry-80001918000105').should('not.exist');
    });
  });
});
