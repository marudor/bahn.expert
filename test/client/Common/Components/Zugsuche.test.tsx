import { fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import { render } from 'testHelper';
import React from 'react';
import Zugsuche from 'Common/Components/Zugsuche';

describe('Zugsuche', () => {
  const dummyTrigger = (toggleModal: any) => (
    <div onClick={toggleModal} data-testid="dummytoggle" />
  );

  const renderZugsuche = () =>
    render(Zugsuche, { children: dummyTrigger }, { withNavigation: true });

  it('renders children', () => {
    const { getByTestId } = renderZugsuche();

    getByTestId('dummytoggle');
  });

  it('closed by default', () => {
    const { queryByTestId } = renderZugsuche();

    expect(queryByTestId('Zugsuche')).toBeNull();
  });

  it('can be opened', () => {
    const { getByTestId } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    getByTestId('Zugsuche');
  });

  it('entering nothing & submit keeps it open', async () => {
    const { getByTestId } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    fireEvent.click(getByTestId('ZugsucheSubmit'));
    await new Promise(resolve => setTimeout(resolve, 200));
    getByTestId('Zugsuche');
  });

  it('Navigates to details', async () => {
    const { getByTestId, queryByTestId, getLocation } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    fireEvent.change(getByTestId('ZugsucheInput'), {
      target: { value: 'EC 6 ' },
    });
    fireEvent.click(getByTestId('ZugsucheSubmit'));
    await waitForElementToBeRemoved(() => getByTestId('Zugsuche'));
    expect(queryByTestId('Zugsuche')).toBeNull();
    expect(getLocation().pathname.startsWith('/details/EC 6')).toBeTruthy();
  });

  it('Navigates to OEBB if cookie set', () => {
    const { getByTestId, getLocation, cookies } = renderZugsuche();

    fireEvent.click(getByTestId('dummytoggle'));
    fireEvent.change(getByTestId('ZugsucheInput'), {
      target: { value: 'EC 6 ' },
    });
    cookies.set('rconfig', {
      hafasProfile: 'oebb',
    });

    fireEvent.click(getByTestId('ZugsucheSubmit'));
    expect(getLocation().search).toBe('?profile=oebb');
  });
});
