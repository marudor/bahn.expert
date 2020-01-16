import { render, RenderOptions } from '@testing-library/react-native';
import { StorageContext } from 'shared/hooks/useStorage';
import React, { ReactElement } from 'react';
import Storage from '@/Storage';

const StorageWrapper = ({ children }: any) => {
  const storage = new Storage();

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
};
const customRender = (ui: ReactElement<any>, options?: RenderOptions) =>
  render(ui, { wrapper: StorageWrapper, ...options });

export * from '@testing-library/react-native';
export { customRender as render };
