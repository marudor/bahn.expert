import { createContainer } from 'unstated-next';
import { defaultConfig, setCookieOptions } from 'client/util';
import { MarudorConfig } from 'Common/config';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';
import useQuery from 'Common/hooks/useQuery';

export type Filter = {
  onlyDepartures?: boolean;
  products: string[];
};
const defaultFilter: Filter = {
  products: [],
};

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
    cookies.set('defaultFilter', productFilter, setCookieOptions);
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

const useConfig = (initialConfig: MarudorConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const [configOpen, setConfigOpen] = useState(false);
  const cookies = useCookies();

  const setConfigKey = useCallback(
    <K extends keyof MarudorConfig>(key: K, value: MarudorConfig[K]) => {
      const newConfig = {
        ...config,
        [key]: value,
      };

      cookies.set('config', newConfig, setCookieOptions);
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

export type AbfahrtenConfig = {
  filter: Filter;
  config: MarudorConfig;
};

const defaultAbfahrtenConfig: AbfahrtenConfig = {
  filter: defaultFilter,
  config: defaultConfig,
};
const useAbfahrtenConfig = (
  initialConfig: AbfahrtenConfig = defaultAbfahrtenConfig
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

type Props = {
  children: ReactNode;
};
export const AbfahrtenConfigProvider = ({ children }: Props) => {
  const cookies = useCookies();
  const query = useQuery();
  const savedFilter = cookies.get('defaultFilter');

  const savedConfig = {
    filter: {
      onlyDepartures: Boolean(query.onlyDepartures),
      products: Array.isArray(savedFilter) ? savedFilter : [],
    },
    config: {
      ...defaultConfig,
      ...cookies.get('config'),
      ...global.configOverride,
    },
  };

  if (Number.isInteger(savedConfig.config.searchType)) {
    delete savedConfig.config.searchType;
  }

  return (
    <AbfahrtenConfigContainer.Provider initialState={savedConfig}>
      {children}
    </AbfahrtenConfigContainer.Provider>
  );
};
