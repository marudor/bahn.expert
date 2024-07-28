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
			cy.get('@maxChanges').type('5');
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
			cy.get('@transferTime').type('5');
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

		it('maxChanges handles 0', () => {
			cy.findByTestId('routingSettingsPanel').click();
			cy.findByTestId('routingSettingsPanel-maxChange').within(() => {
				cy.get('span')
					.as('maxChanges')
					.should('not.have.text', '0')
					.should('be.visible');
			});
			cy.findByTestId('routingMaxChanges').as('maxChangesInput').clear();
			cy.get('@maxChangesInput').type('0');
			cy.get('@maxChanges').should('have.text', '0').should('be.visible');
			cy.visit('/routing');
			cy.get('@maxChanges').should('have.text', '0').should('be.visible');
		});
	});
});
