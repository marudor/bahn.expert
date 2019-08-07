describe('Query Parameter', () => {
  it('noHeader on homepage', () => {
    cy.visit('/?noHeader=true');

    cy.queryByTestId('abfahrtenHeader').should('not.exist');
  });

  it('theme Parameter', () => {
    cy.visit('/?theme=black');

    cy.getCookie('theme').should('have.property', 'value', 'black');
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
  });
});
