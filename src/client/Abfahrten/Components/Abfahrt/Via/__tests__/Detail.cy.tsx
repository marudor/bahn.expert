import { DetailVia } from '@/client/Abfahrten/Components/Abfahrt/Via/Detail';
import { InnerAbfahrtenConfigProvider } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';

describe('DetailVia', () => {
  const mockStops = [
    {
      name: 'first',
    },
    {
      name: 'additional',
      additional: true,
    },
    {
      name: 'cancelled',
      cancelled: true,
    },
    {
      name: 'hbf',
    },
    {
      name: 'last',
    },
  ];

  it('Renders Via as links', () => {
    cy.mount(<DetailVia stops={mockStops} />, {
      provider: [
        {
          Provider: InnerAbfahrtenConfigProvider,
          initialState: {
            initialState: {
              filter: {},
              config: {},
            },
          },
        },
      ],
    })
      .getTheme()
      .then((theme) => {
        cy.get('a')
          .should('have.length', 5)
          .first()
          .should('have.text', mockStops.at(0)?.name)
          .next()
          .should('have.text', mockStops.at(1)?.name)
          .next()
          .should('have.text', mockStops.at(2)?.name)
          .next()
          .should('have.text', mockStops.at(3)?.name)
          .next()
          .should('have.text', mockStops.at(4)?.name)
          .next()
          .should('not.exist');

        cy.findByTestId('via-additional')
          .should('have.attr', 'href', '/additional')
          .should('have.css', 'color', theme.colors.green);

        cy.findByTestId('via-cancelled')
          .should('have.attr', 'href', '/cancelled')
          .should('have.css', 'color', theme.colors.red);

        cy.findByTestId('via-hbf')
          .should('have.attr', 'href', '/hbf')
          .should('have.css', 'font-weight', '700');
      });
  });
});
