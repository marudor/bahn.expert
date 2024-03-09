describe('Abfahrten', () => {
  describe('generic', () => {
    beforeEach(() => {
      cy.mockFrankfurt();
    });
    it('open details', () => {
      cy.visit('/');
      cy.navigateToStation('Frankfurt (Main) Hbf');
      cy.findByTestId('abfahrtS35744').click();
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('scrollMarker').should('exist');
      });
      cy.window().then((w) =>
        cy
          .get('link[rel="canonical"]')
          .should('have.attr', 'href', w.location.href),
      );
    });
    it('opened details should be rememberd on refresh', () => {
      cy.visit('/');
      cy.navigateToStation('Frankfurt (Main) Hbf');
      cy.findByTestId('abfahrtS35744').click();
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('scrollMarker').should('exist');
      });
      cy.visit('/');
      cy.navigateToStation('Frankfurt (Main) Hbf');
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('scrollMarker').should('exist');
      });
    });
    it('details should be closed if you open another', () => {
      cy.visit('/');
      cy.navigateToStation('Frankfurt (Main) Hbf');
      cy.findByTestId('abfahrtS35744').click();
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('scrollMarker').should('exist');
      });

      cy.findByTestId('abfahrtRE4568').click();
      cy.findByTestId('abfahrtRE4568').within(() => {
        cy.findByTestId('scrollMarker').should('exist');
      });
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('scrollMarker').should('not.exist');
      });
    });
  });
  it('going back & showing different station should reload', () => {
    cy.mockFrankfurt({ delay: 500 });
    cy.mockHamburg({ delay: 500 });
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('lookahead').should('exist');
    cy.go('back');
    cy.navigateToStation('Hamburg Hbf');
    cy.findByTestId('loading').should('exist');
    cy.findByTestId('lookahead').should('exist');
  });
  it('cancelled not strike through', () => {
    cy.mockHamburg();
    cy.visit('/');
    cy.navigateToStation('Hamburg Hbf');
    cy.findByTestId('abfahrtRB81616').within(() => {
      cy.findByTestId('cancelled').should(
        'not.have.css',
        'text-decoration-line',
        'line-through',
      );
      for (const id of ['destination', 'platform', 'timeContainer']) {
        cy.findByTestId(id).should(
          'have.css',
          'text-decoration-line',
          'line-through',
        );
      }
    });
    cy.percySnapshot('Abfahrten');
  });
});
