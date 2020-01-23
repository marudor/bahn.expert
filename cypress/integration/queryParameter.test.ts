describe('Query Parameter', () => {
  it('noHeader on homepage', () => {
    cy.visit('/?noHeader=true');

    cy.queryByTestId('abfahrtenHeader').should('not.exist');
  });

  it('theme Parameter', () => {
    cy.visit('/?theme=black');

    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
  });
  it('Lookbehind not saving in cookie', () => {
    cy.mockFrankfurt({ lookbehind: 10 });
    cy.visit('/');
    cy.openSettings();
    cy.findByTestId('lookbehind').type('10');
    cy.getAbfahrtenConfig().should('have.property', 'lookbehind', 10);
    cy.mockFrankfurt({ lookbehind: 150 });
    cy.visit('/Frankfurt (Main) Hbf?lookbehind=150');
    cy.getAbfahrtenConfig().should('have.property', 'lookbehind', 10);
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.getAbfahrtenConfig().should('have.property', 'lookbehind', 10);
  });
});
