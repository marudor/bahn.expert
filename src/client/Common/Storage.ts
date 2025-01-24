import type { Favs } from '@/client/Abfahrten/hooks/useFavs';
import type { CommonConfig } from '@/client/Common/config';
import type { RoutingSettings } from '@/client/Routing/provider/RoutingConfigProvider';
import type { RoutingFavs } from '@/client/Routing/provider/RoutingFavProvider';
import Cookies from 'universal-cookie';
import type { CookieGetOptions, CookieSetOptions } from 'universal-cookie';

const setCookieOptions: CookieSetOptions = {
	maxAge: 100000000,
	httpOnly: false,
	path: '/',
	sameSite: 'lax',
};

export interface WebConfigMap extends CommonConfig, RoutingSettings {
	readonly selectedDetail: string;
	readonly favs: Favs;
	readonly rfavs: RoutingFavs;
	readonly defaultFilter: string[];
	readonly timesPoliticSeen2: number;
	readonly timesFeedback: number;
	readonly bw2025: number;
}

export interface StorageInterface extends Cookies {
	get<K extends keyof WebConfigMap>(
		name: K,
		options?: CookieGetOptions,
	): WebConfigMap[K] | undefined;
	get<T>(name: string, options?: CookieGetOptions): T | undefined;
	set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]): void;
	set<T>(name: string, value: T): void;
	remove<K extends keyof WebConfigMap>(name: K): void;
}

export class ServerStorage extends Cookies implements StorageInterface {
	get<K extends keyof WebConfigMap>(
		name: K,
		options?: CookieGetOptions,
	): WebConfigMap[K] | undefined {
		return super.get(name, options);
	}
	set<K extends keyof WebConfigMap>(name: K, value: WebConfigMap[K]): void {
		super.set(name, value, setCookieOptions);
	}
}

export class ClientStorage extends ServerStorage {
	get<K extends keyof WebConfigMap>(
		name: K,
		options?: CookieGetOptions,
	): WebConfigMap[K] | undefined {
		const cookieGet = super.get(name, options);
		if (cookieGet != null) return cookieGet;
		return undefined;
	}
}
