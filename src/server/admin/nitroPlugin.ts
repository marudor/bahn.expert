import createAdminServer from './index';

export default () => {
	if (globalThis.adminServer) {
		globalThis.adminServer.close();
	}
	globalThis.adminServer = createAdminServer();
};
