import { InnerAbfahrtenConfigProvider } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
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

describe('SettingsModal', () => {
  it('Opens if container set', () => {
    cy.mount(<OpenDummy />, {
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

    cy.findByTestId('settingsContent').should('not.exist');
    cy.findByTestId('open').click();
    cy.findByTestId('settingsContent').should('be.visible');
  });
});
