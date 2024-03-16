import { NormalVia } from '@/client/Abfahrten/Components/Abfahrt/Via/Normal';

describe('NormalVia', () => {
  const mockStops = [
    {
      name: 'first',
    },
    {
      name: 'additional',
      additional: true,
      showVia: true,
    },
    {
      name: 'cancelled',
      cancelled: true,
    },
    {
      name: 'hbf',
      showVia: true,
    },
    {
      name: 'last',
    },
  ];

  it('Renders Via are not links', () => {
    cy.mount(<NormalVia stops={mockStops} />);

    cy.getTheme().then((theme) => {
      cy.findByTestId('via-additional')
        .should('not.have.attr', 'href', 'additional')
        .should('have.css', 'color', theme.vars.palette.common.green);

      cy.findByTestId('via-cancelled').should('not.exist');

      cy.findByTestId('via-hbf')
        .should('not.have.attr', 'href', 'hbf')
        .should('have.css', 'font-weight', '700');
    });
  });
});
