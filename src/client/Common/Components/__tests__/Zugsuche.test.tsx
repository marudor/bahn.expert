import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { render } from '@/client/__tests__/testHelper';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';

describe('Zugsuche', () => {
  const dummyTrigger = (toggleModal: any) => (
    <div onClick={toggleModal} data-testid="dummytoggle" />
  );

  const renderZugsuche = () =>
    render(<Zugsuche>{dummyTrigger}</Zugsuche>, { withNavigation: true });

  it('renders children', () => {
    renderZugsuche();

    expect(screen.getByTestId('dummytoggle')).toBeInTheDocument();
  });

  it('closed by default', () => {
    renderZugsuche();

    expect(screen.queryByTestId('Zugsuche')).toBeNull();
  });

  it('can be opened', () => {
    renderZugsuche();

    fireEvent.click(screen.getByTestId('dummytoggle'));
    expect(screen.getByTestId('Zugsuche')).toBeInTheDocument();
  });

  describe('Uses Search', () => {
    beforeEach(() => {
      nock
        .get('/api/journeys/v1/find/EC 6')
        .query(true)
        .reply(200, [
          {
            jid: 'test',
            train: {
              type: 'EC',
              number: 6,
              name: 'EC 6',
            },
            lastStop: {
              station: {
                title: 'Dortmund Hbf',
              },
            },
            firstStop: {
              station: {
                id: 6000,
              },
            },
          },
        ]);
    });

    it('Navigates to details', async () => {
      const { getLocation } = renderZugsuche();

      fireEvent.click(screen.getByTestId('dummytoggle'));
      fireEvent.change(screen.getByTestId('zugsucheAutocompleteInput'), {
        target: { value: 'EC 6' },
      });
      await screen.findByTestId('zugsucheAutocompleteItem');
      fireEvent.click(screen.getByTestId('zugsucheAutocompleteItem'));
      await waitForElementToBeRemoved(() => screen.queryByTestId('Zugsuche'));
      expect(screen.queryByTestId('Zugsuche')).toBeNull();
      expect(getLocation().pathname.startsWith('/details/EC 6')).toBeTruthy();
      expect(getLocation().search.includes('station=6000')).toBeTruthy();
    });
  });
});
