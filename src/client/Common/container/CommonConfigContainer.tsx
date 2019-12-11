import { CommonConfig } from 'Common/config';
import { createContainer } from 'unstated-next';
import { defaultCommonConfig, setCookieOptions } from 'client/util';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';

const configCookieName = 'commonConfig';

const useCommonConfig = (initialConfig: CommonConfig = defaultCommonConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const cookies = useCookies();
  const setCommonConfigKey = useCallback(
    <K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
      const newConfig = {
        ...config,
        [key]: value,
      };

      cookies.set(configCookieName, newConfig, setCookieOptions);
      setConfig(newConfig);
    },
    [config, cookies]
  );

  return {
    config,
    setCommonConfigKey,
  };
};

const CommonConfigContainer = createContainer(useCommonConfig);

export default CommonConfigContainer;

interface Props {
  children: ReactNode;
}

export const CommonConfigProvider = ({ children }: Props) => {
  const cookies = useCookies();

  const savedAbfahrtenConfig = cookies.get('config');
  const savedCommonConfig = cookies.get(configCookieName);

  const savedConfig = {
    ...defaultCommonConfig,
    ...savedAbfahrtenConfig,
    ...savedCommonConfig,
    ...global.configOverride.common,
  };

  return (
    <CommonConfigContainer.Provider initialState={savedConfig}>
      {children}
    </CommonConfigContainer.Provider>
  );
};
