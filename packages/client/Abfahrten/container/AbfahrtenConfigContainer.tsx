import { abfahrtenConfigSanitize } from 'client/util';
import { createContainer } from 'unstated-next';
import { ReactNode, useCallback, useState } from 'react';
import { StationSearchType } from 'types/station';
import useQuery from 'client/Common/hooks/useQuery';
import useWebStorage from 'client/useWebStorage';
import type { AbfahrtenConfig } from 'client/Common/config';

export interface Filter {
  onlyDepartures?: boolean;
  products: string[];
}

const filterCookieName = 'defaultFilter';

const useFilter = (initialFilter: Filter) => {
  const storage = useWebStorage();
  const [filterOpen, setFilterOpen] = useState(false);
  const [onlyDepartures] = useState(initialFilter.onlyDepartures);
  const [productFilter, setProductFilter] = useState(initialFilter.products);
  const toggleProduct = useCallback((product: string) => {
    setProductFilter((oldProducts) => {
      if (oldProducts.includes(product)) {
        return oldProducts.filter((p) => p !== product);
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
  const storage = useWebStorage();

  const setConfigKey = useCallback(
    <K extends keyof AbfahrtenConfig>(key: K, value: AbfahrtenConfig[K]) => {
      storage.set(key, value);
      setConfig((oldConfig) => ({ ...oldConfig, [key]: value }));
    },
    [storage]
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
  fetchApiUrl: string;
  urlPrefix: string;
}

const useAbfahrtenConfig = (initialConfig: AbfahrtenContainerValue) => {
  const filterConfig = useFilter(initialConfig.filter);
  const config = useConfig(initialConfig.config);

  return {
    ...filterConfig,
    ...config,
    fetchApiUrl: initialConfig.fetchApiUrl,
    urlPrefix: initialConfig.urlPrefix,
  };
};

// @ts-ignore works, complains about missing default
const AbfahrtenConfigContainer = createContainer(useAbfahrtenConfig);

export default AbfahrtenConfigContainer;

const migrateOldConfig = (storage: ReturnType<typeof useWebStorage>) => {
  const oldConfig = storage.get<AbfahrtenConfig>('config');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('config');
  }
};

interface Props {
  children: ReactNode;
  fetchApiUrl: string;
  urlPrefix: string;
}
export const AbfahrtenConfigProvider = ({
  children,
  fetchApiUrl,
  urlPrefix,
}: Props) => {
  const storage = useWebStorage();
  migrateOldConfig(storage);
  const query = useQuery();
  const savedFilter = storage.get(filterCookieName);

  const savedConfig: AbfahrtenContainerValue = {
    filter: {
      onlyDepartures: Boolean(query.onlyDepartures),
      products: Array.isArray(savedFilter) ? savedFilter : [],
    },
    config: {
      autoUpdate: abfahrtenConfigSanitize.autoUpdate(
        storage.get<string>('autoUpdate')
      ),
      lineAndNumber: storage.get('lineAndNumber') ?? false,
      lookahead: storage.get('lookahead') ?? '150',
      lookbehind: storage.get('lookbehind') ?? '0',
      searchType: storage.get('searchType') ?? StationSearchType.default,
      showSupersededMessages: storage.get('showSupersededMessages') ?? false,
      ...global.configOverride.abfahrten,
    },
    fetchApiUrl,
    urlPrefix,
  };

  return (
    <AbfahrtenConfigContainer.Provider initialState={savedConfig}>
      {children}
    </AbfahrtenConfigContainer.Provider>
  );
};
