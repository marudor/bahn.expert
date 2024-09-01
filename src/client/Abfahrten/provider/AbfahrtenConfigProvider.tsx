import { useQuery } from '@/client/Common/hooks/useQuery';
import type { trpc } from '@/client/RPC';
import { useStorage } from '@/client/useStorage';
import constate from 'constate';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export interface Filter {
	onlyDepartures?: boolean;
	products: string[];
}

const filterCookieName = 'defaultFilter';

const useFilter = (initialFilter: Filter) => {
	const storage = useStorage();
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

export interface AbfahrtenConfigProviderValue {
	filter: Filter;
	abfahrtenFetch: ReturnType<typeof trpc.useUtils>['iris']['abfahrten'];
	urlPrefix: string;
}

const useAbfahrtenConfigInner = ({
	initialState,
}: PropsWithChildren<{
	initialState: AbfahrtenConfigProviderValue;
}>) => {
	const filterConfig = useFilter(initialState.filter);

	return {
		filterConfig,
		abfahrtenFetch: initialState.abfahrtenFetch,
		urlPrefix: initialState.urlPrefix,
	};
};

export const [
	InnerAbfahrtenConfigProvider,
	useAbfahrtenFetch,
	useAbfahrtenUrlPrefix,
	useAbfahrtenFilterOpen,
	useAbfahrtenFilter,
] = constate(
	useAbfahrtenConfigInner,
	(v) => v.abfahrtenFetch,
	(v) => v.urlPrefix,
	(v) => v.filterConfig.setFilterOpen,
	(v) => v.filterConfig,
);

interface Props {
	children: ReactNode;
	abfahrtenFetch: AbfahrtenConfigProviderValue['abfahrtenFetch'];
	urlPrefix: string;
}
export const AbfahrtenConfigProvider: FC<Props> = ({
	children,
	abfahrtenFetch,
	urlPrefix,
}) => {
	const storage = useStorage();
	const query = useQuery();
	const queryFilter = Array.isArray(query.filter)
		? (query.filter as string[])
		: typeof query.filter === 'string'
			? query.filter.split(',')
			: undefined;
	const savedFilter = queryFilter || storage.get(filterCookieName);

	const savedConfig: AbfahrtenConfigProviderValue = {
		filter: {
			products: Array.isArray(savedFilter) ? savedFilter : [],
		},
		abfahrtenFetch,
		urlPrefix,
	};

	return (
		<InnerAbfahrtenConfigProvider initialState={savedConfig}>
			{children}
		</InnerAbfahrtenConfigProvider>
	);
};
