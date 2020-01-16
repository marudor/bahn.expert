import { AbfahrtenConfig } from 'Common/config';
import { createContainer } from 'unstated-next';
import { defaultAbfahrtenConfig } from 'client/util';
import React, { ReactNode, useCallback, useState } from 'react';
import useQuery from 'Common/hooks/useQuery';
import useStorage from 'shared/hooks/useStorage';

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
  const storage = useStorage();
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
    storage.set(filterCookieName, productFilter);
  }, [productFilter, storage]);

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
  const storage = useStorage();

  const setConfigKey = useCallback(
    <K extends keyof AbfahrtenConfig>(key: K, value: AbfahrtenConfig[K]) => {
      const newConfig = {
        ...config,
        [key]: value,
      };

      storage.set(configCookieName, newConfig);
      setConfig(newConfig);
    },
    [config, storage]
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
  const storage = useStorage();
  const query = useQuery();
  const savedFilter = storage.get(filterCookieName);

  const savedConfig = {
    filter: {
      onlyDepartures: Boolean(query.onlyDepartures),
      products: Array.isArray(savedFilter) ? savedFilter : [],
    },
    config: {
      ...defaultAbfahrtenConfig,
      ...storage.get(configCookieName),
      ...global.configOverride.abfahrten,
    },
  };

  return (
    <AbfahrtenConfigContainer.Provider initialState={savedConfig}>
      {children}
    </AbfahrtenConfigContainer.Provider>
  );
};
