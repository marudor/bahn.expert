import react from '@vitejs/plugin-react-swc';
import vitestConfig from './vitest.config.mjs';

vitestConfig.plugins?.unshift(react());

export default vitestConfig;
