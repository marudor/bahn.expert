describe('Details', () => {
  it('Can Render (with error)', () => {
    cy.intercept('/api/hafas/v2/details/ICE70', {
      statusCode: 404,
      response: {},
    });
    cy.visit('/details/ICE70');
    cy.findByTestId('error').should('exist');
  });

  it('can render & header height correct', () => {
    cy.intercept('/api/hafas/v2/details/S30665', {
      fixture: 'details/S6',
    }).as('details');
    cy.visit('/details/S30665');
    cy.wait('@details');
    cy.findByTestId('header').should('have.css', 'height', '54px');
  });
});
