import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { render } from 'testHelper';
import Zugsuche from 'Common/Components/Zugsuche';

describe('Zugsuche', () => {
  const dummyTrigger = (toggleModal: any) => (
    <div onClick={toggleModal} data-testid="dummytoggle" />
  );

  const renderZugsuche = () =>
    render(Zugsuche, { children: dummyTrigger }, { withNavigation: true });

  it('renders children', () => {
    const { getByTestId } = renderZugsuche();

    expect(getByTestId('dummytoggle')).toBeInTheDocument();
  });

  it('closed by default', () => {
    const { queryByTestId } = renderZugsuche();

    expect(queryByTestId('Zugsuche')).toBeNull();
  });

  it('can be opened', () => {
    const { getByTestId } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    expect(getByTestId('Zugsuche')).toBeInTheDocument();
  });

  it('entering nothing & submit keeps it open', async () => {
    const { getByTestId } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    fireEvent.click(getByTestId('ZugsucheSubmit'));
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getByTestId('Zugsuche')).toBeInTheDocument();
  });

  describe('Uses Search', () => {
    beforeEach(() => {
      nock
        .post(
          '/api/hafas/v1/enrichedJourneyMatch',
          (body) => body.trainName === 'EC 6'
        )
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
      const {
        getByTestId,
        queryByTestId,
        getLocation,
        findByTestId,
      } = renderZugsuche();

      fireEvent.click(getByTestId('dummytoggle'));
      fireEvent.change(getByTestId('zugsucheAutocompleteInput'), {
        target: { value: 'EC 6' },
      });
      await findByTestId('zugsucheAutocompleteItem');
      fireEvent.click(getByTestId('zugsucheAutocompleteItem'));
      fireEvent.click(getByTestId('ZugsucheSubmit'));
      await waitForElementToBeRemoved(() => getByTestId('Zugsuche'));
      expect(queryByTestId('Zugsuche')).toBeNull();
      expect(getLocation().pathname.startsWith('/details/EC 6')).toBeTruthy();
      expect(getLocation().search.includes('station=6000')).toBeTruthy();
    });

    it('Navigates to OEBB if cookie set', async () => {
      const {
        getByTestId,
        getLocation,
        cookies,
        findByTestId,
      } = renderZugsuche();

      fireEvent.click(getByTestId('dummytoggle'));
      fireEvent.change(getByTestId('zugsucheAutocompleteInput'), {
        target: { value: 'EC 6' },
      });
      await findByTestId('zugsucheAutocompleteItem');
      fireEvent.click(getByTestId('zugsucheAutocompleteItem'));
      cookies.set('rconfig', {
        hafasProfile: 'oebb',
      });

      fireEvent.click(getByTestId('ZugsucheSubmit'));
      expect(getLocation().search).toBe('?profile=oebb&station=6000');
    });
  });
});
