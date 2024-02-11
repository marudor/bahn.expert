import { Time } from '@/client/Common/Components/Time';

const sampleTime = new Date('2019-06-12T13:55:37.648Z');

describe('Time', () => {
  it('no time', () => {
    cy.mount(<Time />);
    cy.get('div').should('be.empty');
  });
  it('only scheduled Data', () => {
    cy.mount(<Time real={sampleTime} />);

    cy.findByTestId('realTimeOrDelay').should('not.exist');
    cy.findByTestId('timeToDisplay').should('have.text', '13:55');
  });

  it('10 Minutes delay', () => {
    cy.mount(<Time real={sampleTime} delay={10} />);

    cy.getTheme().then((theme) => {
      cy.findByTestId('timeToDisplay').should('have.text', '13:45');
      cy.findByTestId('realTimeOrDelay')
        .should('have.text', '13:55')
        .should('have.css', 'color', theme.colors.red);
    });
  });

  it('10 Minutes delay, cancelled', () => {
    cy.mount(<Time real={sampleTime} delay={10} cancelled />);

    cy.findByTestId('timeContainer').should(
      'have.css',
      'text-decoration-line',
      'line-through',
    );
    cy.findByTestId('timeToDisplay').should('have.text', '13:45');
    cy.findByTestId('realTimeOrDelay').should('not.exist');
  });

  it('5 Minutes early', () => {
    cy.mount(<Time real={sampleTime} delay={-5} />);

    cy.getTheme().then((theme) => {
      cy.findByTestId('timeToDisplay').should('have.text', '14:00');
      cy.findByTestId('realTimeOrDelay')
        .should('have.text', '13:55')
        .should('have.css', 'color', theme.colors.green);
    });
  });

  it('5 Minutes early, cancelled', () => {
    cy.mount(<Time real={sampleTime} delay={-5} cancelled />);

    cy.findByTestId('timeContainer').should(
      'have.css',
      'text-decoration-line',
      'line-through',
    );
    cy.findByTestId('timeToDisplay').should('have.text', '14:00');
    cy.findByTestId('realTimeOrDelay').should('not.exist');
  });

  it('shows 0 delay number', () => {
    cy.mount(<Time real={sampleTime} delay={0} />);

    cy.getTheme().then((theme) => {
      cy.findByTestId('timeToDisplay').should('have.text', '13:55');
      cy.findByTestId('realTimeOrDelay')
        .should('have.text', '13:55')
        .should('have.css', 'color', theme.colors.green);
    });
  });
});
