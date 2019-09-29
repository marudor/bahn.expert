import { createContainer } from 'unstated-next';
import { setCookieOptions } from 'client/util';
import { useRouter } from 'useRouter';
import qs from 'qs';
import React, { ReactNode, useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';

export type Filter = {
  onlyDepartures?: boolean;
  products: string[];
};
const defaultFilter: Filter = {
  products: [],
};

const useFilter = (initialFilter: Filter) => {
  const cookies = useCookies();
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
  };
};

export type AbfahrtenConfig = {
  filter: Filter;
};
const defaultConfig: AbfahrtenConfig = {
  filter: defaultFilter,
};
const useAbfahrtenConfig = (initialConfig: AbfahrtenConfig = defaultConfig) => {
  const filterConfig = useFilter(initialConfig.filter);

  return filterConfig;
};

const AbfahrtenConfigContainer = createContainer(useAbfahrtenConfig);

export default AbfahrtenConfigContainer;

type Props = {
  children: ReactNode;
};
export const AbfahrtenConfigProvider = ({ children }: Props) => {
  const cookies = useCookies();
  const { location } = useRouter();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const savedFilter = cookies.get('defaultFilter');

  const savedConfig = {
    filter: {
      onlyDepartures: Boolean(query.onlyDepartures),
      products: Array.isArray(savedFilter) ? savedFilter : [],
    },
  };

  return (
    <AbfahrtenConfigContainer.Provider initialState={savedConfig}>
      {children}
    </AbfahrtenConfigContainer.Provider>
  );
};
