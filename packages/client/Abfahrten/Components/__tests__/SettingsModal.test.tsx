import { fireEvent, screen } from '@testing-library/react';
import {
  InnerAbfahrtenConfigProvider,
  useAbfahrtenModalToggle,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { render } from 'client/__tests__/testHelper';
import { SettingsModal } from 'client/Abfahrten/Components/SettingsModal';

const OpenDummy = () => {
  const { setConfigOpen } = useAbfahrtenModalToggle();

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
  render(<OpenDummy />, {
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
  });

describe('SettingsModal', () => {
  it('Opens if container set', () => {
    renderSetup();

    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByTestId('settingsContent')).toBeInTheDocument();
  });
});
