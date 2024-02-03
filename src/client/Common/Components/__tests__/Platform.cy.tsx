import { Platform } from '@/client/Common/Components/Platform';

describe('Platform', () => {
  it('No platform provided', () => {
    cy.mount(<Platform />);
    cy.findByTestId('real').should('be.empty');
  });
  it('scheduled === real', () => {
    cy.mount(<Platform real="1" scheduled="1" />);
    cy.findByTestId('real').should('have.text', '1');
    cy.findByTestId('scheduled').should('not.exist');
  });
  it('scheduled === real & cancelled', () => {
    cy.mount(<Platform real="1" scheduled="1" cancelled />);
    cy.findByTestId('real').should('have.text', '1');
    cy.findByTestId('platform').should(
      'have.css',
      'text-decoration-line',
      'line-through',
    );
  });
  it('scheduled !== real & cancelled', () => {
    cy.mount(<Platform real="1" scheduled="2" cancelled />);
    cy.getTheme().then((theme) => {
      cy.findByTestId('platform')
        .should('have.css', 'text-decoration-line', 'line-through')
        .should('have.css', 'color', theme.colors.red);
      cy.findByTestId('real').should('have.text', '1');
    });
    cy.percySnapshot();
  });
  it('scheduled !== real', () => {
    cy.mount(<Platform real="1" scheduled="2" />);
    cy.getTheme().then((theme) => {
      cy.findByTestId('real').should('have.text', '1');
      cy.findByTestId('scheduled')
        .should('have.text', '(2)')
        .should('have.css', 'text-decoration-line', 'line-through')
        .should('have.css', 'color', theme.colors.red);
      cy.findByTestId('platform')
        .should('not.have.css', 'text-decoration-line', 'line-through')
        .should('have.css', 'color', theme.colors.red);
    });
  });
});
