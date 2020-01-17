describe('Details', () => {
  it('Can Render (with error)', () => {
    cy.server();
    cy.route({
      url: '/api/hafas/v1/details/ICE70',
      status: 404,
      response: {},
    });
    cy.visit('/details/ICE70');
    cy.findByTestId('error').should('exist');
  });
});
