import constate from '@/constate';
import type { Abfahrt } from '@/types/iris';

interface AbfahrtInitialState {
	abfahrt: Abfahrt;
	detail: boolean;
}

const useInternalAbfahrt = ({ abfahrt, detail }: AbfahrtInitialState) => {
	return {
		abfahrt,
		detail,
	};
};

export const [AbfahrtProvider, useAbfahrt] = constate(useInternalAbfahrt);
