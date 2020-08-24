describe('About', () => {
  it('Successfully renders', () => {
    cy.visit('/about');
    cy.findByTestId('Privacy').should('exist');
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.window().then((w) =>
      cy
        .get('link[rel="canonical"]')
        .should('have.attr', 'href', w.location.href),
    );
  });
});
