import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import { useQuery } from '@/client/Common/hooks/useQuery';
import type { trpc } from '@/client/RPC';
import constate from 'constate';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export interface Filter {
	products: string[];
}

const filterCookieName = 'defaultFilter' as const;

const useFilter = (initialFilter: Filter) => {
	const [_, setCookie] = useExpertCookies([filterCookieName]);
	const [filterOpen, setFilterOpen] = useState(false);
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
		setCookie(filterCookieName, productFilter);
	}, [productFilter, setCookie]);

	return {
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
	const [filterCookie] = useExpertCookies([filterCookieName]);
	const query = useQuery();
	const queryFilter = Array.isArray(query.filter)
		? (query.filter as string[])
		: typeof query.filter === 'string'
			? query.filter.split(',')
			: undefined;
	const savedFilter = queryFilter || filterCookie.defaultFilter;

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
