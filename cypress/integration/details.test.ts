describe('Details', () => {
  it('Can Render (with error)', () => {
    cy.route({
      url: '/api/hafas/v1/details/ICE70',
      status: 404,
      response: {},
    });
    cy.visit('/details/ICE70');
    cy.findByTestId('error').should('exist');
  });

  it('can render & header height correct', () => {
    cy.route('/api/hafas/v1/details/S30665', 'fixture:details/S6.json').as(
      'details'
    );
    cy.visit('/details/S30665');
    cy.wait('@details');
    cy.findByTestId('header').should('have.css', 'height', '98px');
  });
});
