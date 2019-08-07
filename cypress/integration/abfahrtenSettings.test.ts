describe('Abfahrten Settings', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.mockFrankfurt();
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
  });

  it('Show Zugnummer & Linie', () => {
    cy.getByTestId('abfahrtS35744').within(() => {
      cy.getByTestId('abfahrtStart').should('have.text', 'S 7');
    });
    cy.getByTestId('menu').click();
    cy.getByTestId('openSettings').click();
    cy.getByTestId('lineAndNumberConfig').click();
    cy.closeModal();
    cy.getByTestId('abfahrtS35744').within(() => {
      cy.getByTestId('abfahrtStart').should('have.text', 'S 7S 35744');
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
    cy.getByTestId('abfahrtICE371').click();
    cy.getByTestId('menu').click();
    cy.getByTestId('openSettings').click();
    cy.getByTestId('fahrzeugGruppeConfig').click();
    cy.closeModal();
    cy.getByTestId('reihungFahrzeugGruppe').should('exist');
  });
});
