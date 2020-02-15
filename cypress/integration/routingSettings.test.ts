describe('Routing Settings', () => {
  describe('normal', () => {
    beforeEach(() => {
      cy.visit('/routing');
    });
    it('can change settings', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '-1 Umstiege')
        .click();
      cy.findByTestId('routingMaxChanges')
        .clear()
        .type('5');
      cy.findByTestId('routingSettingsPanel').should(
        'include.text',
        '5 Umstiege'
      );
    });

    it('changed settings saved', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '0m Umstiegszeit')
        .click();
      cy.findByTestId('routingTransferTime')
        .clear()
        .type('5');
      cy.findByTestId('routingSettingsPanel').should(
        'include.text',
        '5m Umstiegszeit'
      );
      cy.visit('/routing');
      cy.findByTestId('routingSettingsPanel').should(
        'include.text',
        '5m Umstiegszeit'
      );
    });
  });
});
