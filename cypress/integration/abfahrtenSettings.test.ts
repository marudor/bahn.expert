describe('Abfahrten Settings', () => {
  describe('on Abfahrten Page', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.mockFrankfurt();
      cy.navigateToStation('Frankfurt (Main) Hbf');
    });

    it('Show Zugnummer & Linie', () => {
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('abfahrtStart').should('have.text', 'S 7');
      });
      cy.openSettings();
      cy.findByTestId('lineAndNumberConfig').click();
      cy.closeModal();
      cy.findByTestId('abfahrtS35744').within(() => {
        cy.findByTestId('abfahrtStart').should('have.text', 'S 7S 35744');
      });
    });

    it('Show fahrzeuggruppe', () => {
      cy.route(
        '/api/hafas/v1/auslastung/8000105/Interlaken Ost/371/1565182200000',
        { first: 1, second: 1 }
      );
      cy.route(
        '/api/reihung/v1/wagen/371/1565182200000',
        'fixture:sequence/genericICE1.json'
      );
      cy.findByTestId('abfahrtICE371').click();
      cy.openSettings();
      cy.findByTestId('fahrzeugGruppeConfig').click();
      cy.closeModal();
      cy.findByTestId('reihungFahrzeugGruppe').should('exist');
    });
  });

  it('Set searchType', () => {
    cy.visit('/');
    cy.openSettings();
    cy.findByTestId('searchType').within(() => {
      cy.get('select').select('hafas');
    });
    cy.getCookie('searchType').should('be', 'hafas');
  });

  it('set lookbehind', () => {
    cy.visit('/');
    cy.openSettings();
    cy.findByTestId('lookbehind').within(() => {
      cy.get('select').select('240');
    });
    cy.getCookie('lookbehind').should('be', '240');
  });
});
