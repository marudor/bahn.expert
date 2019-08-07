describe('Reihung', () => {
  beforeEach(() => {
    cy.mockFrankfurt();
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.route(
      '/api/hafas/current/auslastung/8000105/Interlaken Ost/371/1565182200000',
      { first: 1, second: 1 }
    );
    cy.route(
      '/api/reihung/current/wagen/371/1565182200000',
      'fixture:reihungICE1.json'
    );
    cy.getByTestId('abfahrtICE371').click();
  });

  it('loads Reihung', () => {
    cy.getByTestId('reihung').should('exist');
  });

  it('Legend useable', () => {
    cy.getByTestId('reihungLegendOpener').click();
    cy.getByTestId('reihungLegend').should('exist');
    cy.closeModal();
    cy.getByTestId('reihung').should('exist');
  });
});
