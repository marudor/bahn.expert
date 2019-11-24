describe('Filter', () => {
  function openFilter() {
    cy.findByTestId('menu').click();
    cy.findByTestId('openFilter').click();
  }
  beforeEach(() => {
    cy.mockFrankfurt();
  });
  it('Type Filter Temporary', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('abfahrtS35744').should('exist');
    openFilter();
    cy.findByTestId('filterS').click();
    cy.closeModal();
    cy.queryByTestId('abfahrtS35744').should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('abfahrtS35744').should('exist');
  });

  it('Type Filter default', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('abfahrtS35744').should('exist');
    openFilter();
    cy.findByTestId('filterS').click();
    cy.findByTestId('filterSubmit').click();
    cy.queryByTestId('abfahrtS35744').should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.queryByTestId('abfahrtS35744').should('not.exist');
  });

  it('onlyDepartures', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.findByTestId('abfahrtICE1632').should('exist');
    cy.visit('/?onlyDepartures=true');
    cy.navigateToStation('Frankfurt (Main) Hbf');
    cy.queryByTestId('abfahrtICE1632').should('not.exist');
  });
});
