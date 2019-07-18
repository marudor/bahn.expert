import {
  addTestcafeTestingLibrary,
  queryByTestId,
} from '@testing-library/testcafe';

export function setupTest(name: string) {
  fixture(name)
    .beforeEach(addTestcafeTestingLibrary)
    .page(process.env.E2E_URL || '');
}

export function awaitLoading(t: TestController) {
  return t
    .expect(queryByTestId('loading').exists)
    .notOk(undefined, { timeout: 13000 });
}
