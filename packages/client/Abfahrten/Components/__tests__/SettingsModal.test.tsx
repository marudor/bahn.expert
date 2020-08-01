import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import { fireEvent } from '@testing-library/react';
import { render } from 'client/__tests__/testHelper';
import { SettingsModal } from 'client/Abfahrten/Components/SettingsModal';

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
    container: [
      {
        ...AbfahrtenConfigContainer,
        initialState: {
          filter: {},
          config: {},
        },
      },
    ],
  });

describe('SettingsModal', () => {
  it('Opens if container set', () => {
    const { getByTestId } = renderSetup();

    fireEvent.click(getByTestId('open'));
    expect(getByTestId('settingsContent')).toBeInTheDocument();
  });
});
