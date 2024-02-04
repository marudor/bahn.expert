import { Zugsuche } from '@/client/Common/Components/Zugsuche';

describe('Zugsuche', () => {
  const dummyTrigger = (toggleModal: any) => (
    <div onClick={toggleModal} data-testid="dummytoggle">
      toggle
    </div>
  );

  const renderZugsuche = () =>
    cy.mount(<Zugsuche>{dummyTrigger}</Zugsuche>, { withNavigation: true });

  it('renders children', () => {
    renderZugsuche();
    cy.findByTestId('dummytoggle').should('be.visible');
  });

  it('closed by default', () => {
    renderZugsuche();
    cy.findByTestId('Zugsuche').should('not.exist');
  });

  it('can be opened', () => {
    renderZugsuche();
    cy.findByTestId('dummytoggle').click();
    cy.findByTestId('Zugsuche').should('be.visible');
  });

  it.only('Navigates to details', () => {
    cy.intercept(
      {
        url: '/api/journeys/v1/find/number/6?*',
      },
      {
        body: [
          {
            jid: 'ee7b2fbd-1370-4585-8108-22938c252836',
            train: { name: 'EC 6', line: null, type: 'EC', number: '6' },
            stops: [],
            firstStop: {
              station: { evaNumber: '6000', name: 'Interlaken Ost' },
            },
            lastStop: { station: { evaNumber: '8000050', name: 'Bremen Hbf' } },
          },
        ],
      },
    );
    renderZugsuche();

    cy.findByTestId('dummytoggle').click();
    cy.findByTestId('zugsucheAutocompleteInput').type('6');
    cy.findByTestId('zugsucheAutocompleteItem').click();
    cy.findByTestId('Zugsuche').should('not.exist');
    cy.location('pathname').should('include', encodeURI('/details/EC 6'));
    cy.location('search').should('include', 'station=6000');
  });
});
