import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import constate from '@/constate';
import { useSearch } from '@tanstack/react-router';
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
}

const useAbfahrtenConfigInner = ({
	initialState,
}: PropsWithChildren<{
	initialState: AbfahrtenConfigProviderValue;
}>) => {
	const filterConfig = useFilter(initialState.filter);

	return {
		filterConfig,
	};
};

export const [
	InnerAbfahrtenConfigProvider,
	useAbfahrtenFilterOpen,
	useAbfahrtenFilter,
] = constate(
	useAbfahrtenConfigInner,
	(v) => v.filterConfig.setFilterOpen,
	(v) => v.filterConfig,
);

interface Props {
	children: ReactNode;
}
export const AbfahrtenConfigProvider: FC<Props> = ({ children }) => {
	const [filterCookie] = useExpertCookies([filterCookieName]);
	const queryFilter = useSearch({
		strict: false,
		select: (s) => s.filter?.split(','),
	});
	const savedFilter = queryFilter || filterCookie.defaultFilter;

	const savedConfig: AbfahrtenConfigProviderValue = {
		filter: {
			products: Array.isArray(savedFilter) ? savedFilter : [],
		},
	};

	return (
		<InnerAbfahrtenConfigProvider initialState={savedConfig}>
			{children}
		</InnerAbfahrtenConfigProvider>
	);
};
