describe('Routing', () => {
  beforeEach(() => {
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent('Frankfurt Hbf')}?*`,
      { fixture: 'stopPlaceSearchFrankfurtHbf' },
    );
    cy.intercept(
      `/api/stopPlace/v1/search/${encodeURIComponent('Hamburg Hbf')}?*`,
      {
        fixture: 'stopPlaceSearchHamburgHbf',
      },
    );
  });
  describe('Favorites', () => {
    it('Initially no favs', () => {
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry').should('not.exist');
    });

    it('Can save fav, is saved on reload', () => {
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
      cy.setCookie('rfavs', oldFavCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
      cy.getCookie('rfavs').should('have.property', 'value', favCookie);
    });

    it('can load fav from cookie', () => {
      cy.setCookie('rfavs', favCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
    });

    it('can delete fav', () => {
      cy.setCookie('rfavs', favCookie);
      cy.visit('/routing');
      cy.findByTestId('RouteFavEntry-80001918000105').should('exist');
      cy.findByTestId('RouteFavEntry-80001918000105').within(() => {
        cy.findByTestId('deleteFav').click();
      });
      cy.findByTestId('RouteFavEntry-80001918000105').should('not.exist');
    });
  });

  describe('url based', () => {
    beforeEach(() => {
      cy.intercept(`/api/stopPlace/v1/8000105`, {
        fixture: 'stopPlace/8000105',
      });
      cy.intercept('/api/stopPlace/v1/8002549', {
        fixture: 'stopPlace/8002549',
      });
      cy.intercept('/api/stopPlace/v1/8000244', {
        fixture: 'stopPlace/8000244',
      });
    });

    function searchInput(id: string, value: string) {
      cy.findByTestId(id)
        .findByTestId('stopPlaceSearchInput')
        .should('have.value', value);
    }

    it('with start', () => {
      cy.visit('/routing/8000105');
      searchInput('routingStartSearch', 'Frankfurt(Main)Hbf');
      searchInput('routingDestinationSearch', '');
      searchInput('addVia', '');
      cy.findByTestId('routingDatePicker').should('contain.value', 'Jetzt');
    });

    it('with start & destination', () => {
      cy.visit('/routing/8000105/8002549');
      searchInput('routingStartSearch', 'Frankfurt(Main)Hbf');
      searchInput('routingDestinationSearch', 'Hamburg Hbf');
      searchInput('addVia', '');
      cy.findByTestId('routingDatePicker').should('contain.value', 'Jetzt');
    });

    it('with start, destination & time', () => {
      cy.visit('/routing/8000105/8002549/2020-11-17T10:00:15.589Z');
      searchInput('routingStartSearch', 'Frankfurt(Main)Hbf');
      searchInput('routingDestinationSearch', 'Hamburg Hbf');
      searchInput('addVia', '');
      cy.findByTestId('routingDatePicker').should(
        'contain.value',
        'Dienstag 17.11.2020 10:00',
      );
    });

    it('with start, destination, time & 1 via', () => {
      cy.visit('/routing/8000105/8002549/2020-11-17T10:00:15.589Z/8000244|');
      searchInput('routingStartSearch', 'Frankfurt(Main)Hbf');
      searchInput('routingDestinationSearch', 'Hamburg Hbf');
      searchInput('via0', 'Mannheim Hbf');
      searchInput('addVia', '');
      cy.findByTestId('routingDatePicker').should(
        'contain.value',
        'Dienstag 17.11.2020 10:00',
      );
    });

    it('with start, destination, time & 2 via', () => {
      cy.visit(
        '/routing/8000105/8002549/2020-11-17T10:00:15.589Z/8000244|8000105|',
      );
      searchInput('routingStartSearch', 'Frankfurt(Main)Hbf');
      searchInput('routingDestinationSearch', 'Hamburg Hbf');
      searchInput('via0', 'Mannheim Hbf');
      searchInput('via1', 'Frankfurt(Main)Hbf');
      cy.findByTestId('addVia').should('not.exist');
      cy.findByTestId('routingDatePicker').should(
        'contain.value',
        'Dienstag 17.11.2020 10:00',
      );
    });
  });
});
