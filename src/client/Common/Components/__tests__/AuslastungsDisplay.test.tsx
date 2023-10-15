import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { AuslastungsValue } from '@/types/routing';
import { render } from '@/client/__tests__/testHelper';

const createAuslastung = (
  first: AuslastungsValue,
  second: AuslastungsValue,
) => ({
  first,
  second,
});

describe('AuslastungsDisplay', () => {
  it('Gering / Hoch', () => {
    const { container } = render(
      <AuslastungsDisplay
        auslastung={createAuslastung(
          AuslastungsValue.Gering,
          AuslastungsValue.Hoch,
        )}
      />,
    );

    expect(container).toMatchInlineSnapshot(`
      .emotion-0 {
        font-size: .75em;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .emotion-2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        margin-left: 0.2em;
      }

      .emotion-4 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
        background-color: #7cb342;
        color: rgba(0, 0, 0, 0.87);
      }

      .emotion-6 {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 1em;
        height: 1em;
        display: inline-block;
        fill: currentColor;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        -webkit-transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size: inherit;
      }

      .emotion-7 {
        margin: 0 0.25em;
      }

      .emotion-9 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
        background-color: #ffee58;
        color: rgba(0, 0, 0, 0.87);
      }

      <div
        class="emotion-0 emotion-1"
        data-testid="auslastungDisplay"
      >
        Auslastung
        <span
          class="emotion-2 emotion-3"
        >
          <div
            data-testid="first"
          >
            1.
            <span
              class="emotion-4 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="DoneIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                />
              </svg>
            </span>
          </div>
          <span
            class="emotion-7 emotion-8"
          >
            |
          </span>
          <div
            data-testid="second"
          >
            2.
            <span
              class="emotion-9 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="WarningIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                />
              </svg>
            </span>
          </div>
        </span>
      </div>
    `);
  });

  it('SehrHoch / Ausgebucht', () => {
    const { container } = render(
      <AuslastungsDisplay
        auslastung={createAuslastung(
          AuslastungsValue.SehrHoch,
          AuslastungsValue.Ausgebucht,
        )}
      />,
    );

    expect(container).toMatchInlineSnapshot(`
      .emotion-0 {
        font-size: .75em;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .emotion-2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        margin-left: 0.2em;
      }

      .emotion-4 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
        background-color: #ffa726;
        color: rgba(0, 0, 0, 0.87);
      }

      .emotion-6 {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 1em;
        height: 1em;
        display: inline-block;
        fill: currentColor;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        -webkit-transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size: inherit;
      }

      .emotion-7 {
        margin: 0 0.25em;
      }

      .emotion-9 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
        background-color: #ff1744;
        color: #fff;
      }

      <div
        class="emotion-0 emotion-1"
        data-testid="auslastungDisplay"
      >
        Auslastung
        <span
          class="emotion-2 emotion-3"
        >
          <div
            data-testid="first"
          >
            1.
            <span
              class="emotion-4 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="ErrorOutlineIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                />
              </svg>
            </span>
          </div>
          <span
            class="emotion-7 emotion-8"
          >
            |
          </span>
          <div
            data-testid="second"
          >
            2.
            <span
              class="emotion-9 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="CloseIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </span>
          </div>
        </span>
      </div>
    `);
  });

  it('Unbekannt / Hoch', () => {
    const { container } = render(
      <AuslastungsDisplay
        // @ts-expect-error wrong type for test only
        auslastung={createAuslastung('something', AuslastungsValue.Hoch)}
      />,
    );

    expect(container).toMatchInlineSnapshot(`
      .emotion-0 {
        font-size: .75em;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
      }

      .emotion-2 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        margin-left: 0.2em;
      }

      .emotion-4 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
      }

      .emotion-6 {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 1em;
        height: 1em;
        display: inline-block;
        fill: currentColor;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        -webkit-transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        font-size: inherit;
      }

      .emotion-7 {
        margin: 0 0.25em;
      }

      .emotion-9 {
        font-size: .7em;
        display: inline-block;
        border-radius: 50%;
        text-align: center;
        padding: .2em;
        line-height: 0;
        background-color: #ffee58;
        color: rgba(0, 0, 0, 0.87);
      }

      <div
        class="emotion-0 emotion-1"
        data-testid="auslastungDisplay"
      >
        Auslastung
        <span
          class="emotion-2 emotion-3"
        >
          <div
            data-testid="first"
          >
            1.
            <span
              class="emotion-4 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="HelpIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                />
              </svg>
            </span>
          </div>
          <span
            class="emotion-7 emotion-8"
          >
            |
          </span>
          <div
            data-testid="second"
          >
            2.
            <span
              class="emotion-9 emotion-5"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit emotion-6"
                data-testid="WarningIcon"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
                />
              </svg>
            </span>
          </div>
        </span>
      </div>
    `);
  });
});
