import { AbfahrtenConfig } from 'Common/config';
import { createContainer } from 'unstated-next';
import { defaultAbfahrtenConfig, setCookieOptions } from 'client/util';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';
import useQuery from 'Common/hooks/useQuery';

export interface Filter {
  onlyDepartures?: boolean;
  products: string[];
}
const defaultFilter: Filter = {
  products: [],
};

const configCookieName = 'config';
const filterCookieName = 'defaultFilter';

const useFilter = (initialFilter: Filter) => {
  const cookies = useCookies();
  const [filterOpen, setFilterOpen] = useState(false);
  const [onlyDepartures] = useState(initialFilter.onlyDepartures);
  const [productFilter, setProductFilter] = useState(initialFilter.products);
  const toggleProduct = useCallback((product: string) => {
    setProductFilter(oldProducts => {
      if (oldProducts.includes(product)) {
        return oldProducts.filter(p => p !== product);
      }

      return [...oldProducts, product];
    });
  }, []);

  const saveProductFilter = useCallback(() => {
    cookies.set(filterCookieName, productFilter, setCookieOptions);
  }, [cookies, productFilter]);

  return {
    onlyDepartures,
    productFilter,
    toggleProduct,
    saveProductFilter,
    filterOpen,
    setFilterOpen,
  };
};

const useConfig = (initialConfig: AbfahrtenConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const [configOpen, setConfigOpen] = useState(false);
  const cookies = useCookies();

  const setConfigKey = useCallback(
    <K extends keyof AbfahrtenConfig>(key: K, value: AbfahrtenConfig[K]) => {
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
    setConfigKey,
    configOpen,
    setConfigOpen,
  };
};

export interface AbfahrtenContainerValue {
  filter: Filter;
  config: AbfahrtenConfig;
}

const defaultContainerValue: AbfahrtenContainerValue = {
  filter: defaultFilter,
  config: defaultAbfahrtenConfig,
};
const useAbfahrtenConfig = (
  initialConfig: AbfahrtenContainerValue = defaultContainerValue
) => {
  const filterConfig = useFilter(initialConfig.filter);
  const config = useConfig(initialConfig.config);

  return {
    ...filterConfig,
    ...config,
  };
};

const AbfahrtenConfigContainer = createContainer(useAbfahrtenConfig);

export default AbfahrtenConfigContainer;

interface Props {
  children: ReactNode;
}
export const AbfahrtenConfigProvider = ({ children }: Props) => {
  const cookies = useCookies();
  const query = useQuery();
  const savedFilter = cookies.get(filterCookieName);

  const savedConfig = {
    filter: {
      onlyDepartures: Boolean(query.onlyDepartures),
      products: Array.isArray(savedFilter) ? savedFilter : [],
    },
    config: {
      ...defaultAbfahrtenConfig,
      ...cookies.get(configCookieName),
      ...global.configOverride.abfahrten,
    },
  };

  return (
    <AbfahrtenConfigContainer.Provider initialState={savedConfig}>
      {children}
    </AbfahrtenConfigContainer.Provider>
  );
};
