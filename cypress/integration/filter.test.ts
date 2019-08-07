describe('Filter', () => {
  function openFilter() {
    cy.getByTestId('menu').click();
    cy.getByTestId('openFilter').click();
  }
  beforeEach(() => {
    cy.mockFrankfurt();
  });
  it('Type Filter Temporary', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtS35744').should('exist');
    openFilter();
    cy.getByTestId('filterS').click();
    cy.closeModal();
    cy.queryByTestId('abfahrtS35744').should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtS35744').should('exist');
  });

  it('Type Filter default', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtS35744').should('exist');
    openFilter();
    cy.getByTestId('filterS').click();
    cy.getByTestId('filterSubmit').click();
    cy.queryByTestId('abfahrtS35744').should('not.exist');
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.queryByTestId('abfahrtS35744').should('not.exist');
  });

  it('onlyDepartures', () => {
    cy.visit('/');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.getByTestId('abfahrtICE1632').should('exist');
    cy.visit('/?onlyDepartures=true');
    cy.navigateToStation('Frankfurt (Main) Hbf', false);
    cy.queryByTestId('abfahrtICE1632').should('not.exist');
  });
});
