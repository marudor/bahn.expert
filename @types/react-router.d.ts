import 'react-router';
declare module 'react-router' {
	interface StaticRouterContext {
		status?: number;
	}
}
