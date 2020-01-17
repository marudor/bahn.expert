describe('About', () => {
  it('Successfully renders', () => {
    cy.visit('/about');
    cy.findByTestId('Privacy').should('exist');
  });
});
