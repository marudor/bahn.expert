import { fireEvent } from '@testing-library/react';
import { render } from 'testHelper';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import React from 'react';
import SettingsModal from 'Abfahrten/Components/SettingsModal';

const OpenDummy = () => {
  const { setConfigOpen } = AbfahrtenConfigContainer.useContainer();

  return (
    <>
      <span onClick={() => setConfigOpen(true)} data-testid="open">
        open
      </span>
      <SettingsModal />
    </>
  );
};

const renderSetup = () =>
  render(OpenDummy, undefined, {
    container: [AbfahrtenConfigContainer],
  });

describe('SettingsModal', () => {
  it('Opens if container set', () => {
    const { getByTestId } = renderSetup();

    fireEvent.click(getByTestId('open'));
    expect(getByTestId('settingsContent')).toBeInTheDocument();
  });
});
