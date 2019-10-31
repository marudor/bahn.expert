describe('Reihung', () => {
  beforeEach(() => {
    cy.mockFrankfurt();
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.route(
      '/api/hafas/v1/auslastung/8000105/Interlaken Ost/371/1565182200000',
      { first: 1, second: 1 }
    );
    cy.route(
      '/api/reihung/v1/wagen/371/1565182200000',
      'fixture:reihungICE1.json'
    );
    cy.findByTestId('abfahrtICE371').click();
  });

  it('loads Reihung', () => {
    cy.findByTestId('reihung').should('exist');
  });

  it('Legend useable', () => {
    cy.findByTestId('reihungLegendOpener').click();
    cy.findByTestId('reihungLegend').should('exist');
    cy.closeModal();
    cy.findByTestId('reihung').should('exist');
  });
});
