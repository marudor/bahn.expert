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

    it('Setting a time and resetting with "jetzt" resets untouched', () => {
      cy.findByTestId('routingDatePicker').click();
      cy.tick(600 * 1000);
      cy.findByText('OK').click();
      cy.findByTestId('routingDatePicker').should(
        'have.value',
        'Heute, Do 14.04. 13:00',
      );
      cy.findByTestId('search').click({ force: true });
      cy.findByTestId('routingDatePicker')
        .should('have.value', 'Heute, Do 14.04. 13:00')
        .click({ force: true });
      cy.findByText('Jetzt').click();
      cy.findByTestId('routingDatePicker').should(
        'have.value',
        'Jetzt (Heute 13:10)',
      );
      cy.tick(600 * 1000);
      cy.findByTestId('search').click();
      cy.findByTestId('routingDatePicker').should(
        'have.value',
        'Jetzt (Heute 13:20)',
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
