import { fireEvent, screen } from '@testing-library/react';
import { InnerAbfahrtenConfigProvider } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { render } from '@/client/__tests__/testHelper';
import { SettingsModal } from '@/client/Common/Components/SettingsModal';
import { useSetCommonConfigOpen } from '@/client/Common/provider/CommonConfigProvider';

const OpenDummy = () => {
  const setCommonConfigOpen = useSetCommonConfigOpen();

  return (
    <>
      <span onClick={() => setCommonConfigOpen(true)} data-testid="open">
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
