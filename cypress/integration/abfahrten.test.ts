describe('Abfahrten', () => {
  beforeEach(() => {
    cy.mockFrankfurt();
  });
  it('open details', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtS35744').click();
    cy.getByTestId('abfahrtS35744').within(() => {
      cy.getByTestId('scrollMarker').should('exist');
    });
  });
  it('details should be closed if you open another', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtS35744').click();
    cy.getByTestId('abfahrtS35744').within(() => {
      cy.getByTestId('scrollMarker').should('exist');
    });

    cy.getByTestId('abfahrtRE4568').click();
    cy.getByTestId('abfahrtRE4568').within(() => {
      cy.getByTestId('scrollMarker').should('exist');
    });
    cy.getByTestId('abfahrtS35744').within(() => {
      cy.queryByTestId('scrollMarker').should('not.exist');
    });
  });
});
