describe('Abfahrten', () => {
  beforeEach(() => {
    cy.mockFrankfurt();
  });
  it('open details', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.findByTestId('abfahrtS35744').click();
    cy.findByTestId('abfahrtS35744').within(() => {
      cy.findByTestId('scrollMarker').should('exist');
    });
  });
  it('details should be closed if you open another', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.findByTestId('abfahrtS35744').click();
    cy.findByTestId('abfahrtS35744').within(() => {
      cy.findByTestId('scrollMarker').should('exist');
    });

    cy.findByTestId('abfahrtRE4568').click();
    cy.findByTestId('abfahrtRE4568').within(() => {
      cy.findByTestId('scrollMarker').should('exist');
    });
    cy.findByTestId('abfahrtS35744').within(() => {
      cy.queryByTestId('scrollMarker').should('not.exist');
    });
  });
});
