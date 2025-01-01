import type {
	CommonConfig,
	CommonConfigSanitize,
} from '@/client/Common/config';
import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import { useQuery } from '@/client/Common/hooks/useQuery';
import { commonConfigSanitize } from '@/client/util';
import constate from '@/constate';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

const commonConfigKeys: (keyof CommonConfigSanitize)[] = Object.keys(
	commonConfigSanitize,
) as any;

const useCommonConfigInternal = ({
	initialConfig,
}: PropsWithChildren<{
	initialConfig: CommonConfig;
}>) => {
	const [config, setConfig] = useState(initialConfig);
	const [configOpen, setConfigOpen] = useState(false);
	const [, setCookie] = useExpertCookies(commonConfigKeys);
	const setCommonConfigKey = useCallback(
		<K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
			setCookie(key, value);
			setConfig((oldConfig) => ({ ...oldConfig, [key]: value }));
		},
		[setCookie],
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
	const [commmonConfig] = useExpertCookies(commonConfigKeys);
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
		autoUpdate: commonConfigSanitize.autoUpdate(commmonConfig.autoUpdate),
		showUIC: commmonConfig.showUIC ?? false,
		fahrzeugGruppe: commmonConfig.fahrzeugGruppe ?? false,
		showCoachType: commmonConfig.showCoachType ?? true,
		hideTravelynx: commmonConfig.hideTravelynx ?? false,
		lineAndNumber: commmonConfig.lineAndNumber ?? false,
		lookahead: commmonConfig.lookahead ?? '150',
		lookbehind: commmonConfig.lookbehind ?? '10',
		showCancelled: commmonConfig.showCancelled ?? true,
		sortByTime: commmonConfig.sortByTime ?? false,
		onlyDepartures: commmonConfig.onlyDepartures ?? false,
		delayTime: commmonConfig.delayTime ?? false,
		startTime: undefined,
		showRl100: commmonConfig.showRl100 ?? false,
		...commonConfigOverride,
	};

	return (
		<InnerCommonConfigProvider initialConfig={savedConfig}>
			{children}
		</InnerCommonConfigProvider>
	);
};
