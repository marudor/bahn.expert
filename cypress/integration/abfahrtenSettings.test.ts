describe('Abfahrten Settings', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockFrankfurt();
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
  });

  it('Show Zugnummer & Linie', () => {
    cy.findByTestId('abfahrtS35744').within(() => {
      cy.findByTestId('abfahrtStart').should('have.text', 'S 7');
    });
    cy.findByTestId('menu').click();
    cy.findByTestId('openSettings').click();
    cy.findByTestId('lineAndNumberConfig').click();
    cy.closeModal();
    cy.findByTestId('abfahrtS35744').within(() => {
      cy.findByTestId('abfahrtStart').should('have.text', 'S 7S 35744');
    });
  });

  it('Show fahrzeuggruppe', () => {
    cy.route(
      '/api/hafas/current/auslastung/8000105/Interlaken Ost/371/1565182200000',
      { first: 1, second: 1 }
    );
    cy.route(
      '/api/reihung/current/wagen/371/1565182200000',
      'fixture:reihungICE1.json'
    );
    cy.findByTestId('abfahrtICE371').click();
    cy.findByTestId('menu').click();
    cy.findByTestId('openSettings').click();
    cy.findByTestId('fahrzeugGruppeConfig').click();
    cy.closeModal();
    cy.findByTestId('reihungFahrzeugGruppe').should('exist');
  });
});
