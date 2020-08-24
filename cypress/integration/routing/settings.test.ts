describe('Routing Settings', () => {
  describe('normal', () => {
    beforeEach(() => {
      cy.visit('/routing');
    });
    it('can change settings', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '0mAlle Zuege')
        .click();
      cy.findByTestId('routingMaxChanges').clear().type('5');
      cy.findByTestId('routingSettingsPanel-maxChange').should(
        'include.text',
        '5',
      );
    });

    it('changed settings saved', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '0mAlle Zuege')
        .click();
      cy.findByTestId('routingTransferTime').clear().type('5');
      cy.findByTestId('routingSettingsPanel-transferTime').should(
        'include.text',
        '5m',
      );
      cy.visit('/routing');
      cy.findByTestId('routingSettingsPanel-transferTime').should(
        'include.text',
        '5m',
      );
    });
  });
});
