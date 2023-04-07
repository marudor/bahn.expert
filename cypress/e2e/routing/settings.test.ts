describe('Routing Settings', () => {
  describe('mocked time', () => {
    beforeEach(() => {
      const initialDate = new Date('2022-04-14T13:00:00.000Z');
      cy.clock(initialDate);
      cy.visit('/routing');
    });
    it('sets to current Time on "jetzt"', () => {
      cy.findByTestId('routingDatePicker').should(
        'have.value',
        'Jetzt (Heute 13:00)',
      );
      cy.tick(600 * 1000);
      cy.findByTestId('search').click();
      cy.findByTestId('routingDatePicker').should(
        'have.value',
        'Jetzt (Heute 13:10)',
      );
    });
  });

  describe('normal', () => {
    beforeEach(() => {
      cy.visit('/routing');
      cy.force404();
    });
    it('can change settings', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '0mAlle Zuege')
        .click();
      cy.findByTestId('routingMaxChanges').as('maxChanges').clear();
      cy.findByTestId('@maxChanges').type('5');
      cy.findByTestId('routingSettingsPanel-maxChange').should(
        'include.text',
        '5',
      );
    });

    it('changed settings saved', () => {
      cy.findByTestId('routingSettingsPanel')
        .should('include.text', '0mAlle Zuege')
        .click();
      cy.findByTestId('routingTransferTime').as('transferTime').clear();
      cy.findByTestId('@transferTime').type('5');
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
