import type {
	CommonConfig,
	CommonConfigSanitize,
} from '@/client/Common/config';
import { useQuery } from '@/client/Common/hooks/useQuery';
import { useStorage } from '@/client/useStorage';
import { commonConfigSanitize } from '@/client/util';
import constate from 'constate';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

const useCommonConfigInternal = ({
	initialConfig,
}: PropsWithChildren<{
	initialConfig: CommonConfig;
}>) => {
	const [config, setConfig] = useState(initialConfig);
	const [configOpen, setConfigOpen] = useState(false);
	const storage = useStorage();
	const setCommonConfigKey = useCallback(
		<K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
			storage.set(key, value);
			setConfig((oldConfig) => ({ ...oldConfig, [key]: value }));
		},
		[storage],
	);

	return {
		config,
		setCommonConfigKey,
		configOpen,
		setConfigOpen,
	};
};

interface Props {
	children: ReactNode;
}

export const [
	InnerCommonConfigProvider,
	useCommonConfig,
	useSetCommonConfig,
	useSetCommonConfigOpen,
	useCommonConfigOpen,
] = constate(
	useCommonConfigInternal,
	(v) => v.config,
	(v) => v.setCommonConfigKey,
	(v) => v.setConfigOpen,
	(v) => v.configOpen,
);

export const CommonConfigProvider: FC<Props> = ({ children }) => {
	const storage = useStorage();
	const query = useQuery();

	const commonConfigOverride: Record<string, any> = {};
	for (const key of Object.keys(query)) {
		if (key in commonConfigSanitize) {
			commonConfigOverride[key] = commonConfigSanitize[
				key as keyof CommonConfigSanitize
				// @ts-expect-error query might be array, sanitize handles this
			](query[key]);
		}
	}

	const savedConfig: CommonConfig = {
		autoUpdate: commonConfigSanitize.autoUpdate(
			storage.get<string>('autoUpdate'),
		),
		showUIC: storage.get('showUIC') ?? false,
		fahrzeugGruppe: storage.get('fahrzeugGruppe') ?? false,
		showCoachType: storage.get('showCoachType') ?? false,
		hideTravelynx: storage.get('hideTravelynx') ?? false,
		lineAndNumber: storage.get('lineAndNumber') ?? false,
		lookahead: storage.get('lookahead') ?? '150',
		lookbehind: storage.get('lookbehind') ?? '10',
		showCancelled: storage.get('showCancelled') ?? true,
		sortByTime: storage.get('sortByTime') ?? false,
		onlyDepartures: storage.get('onlyDepartures') ?? false,
		delayTime: storage.get('delayTime') ?? false,
		startTime: undefined,
		showRl100: storage.get('showRl100') ?? false,
		...commonConfigOverride,
	};

	return (
		<InnerCommonConfigProvider initialConfig={savedConfig}>
			{children}
		</InnerCommonConfigProvider>
	);
};
