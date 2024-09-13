import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import constate from 'constate';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { useLocation } from 'react-router';

const selectedDetailCookieName = 'selectedDetail';

const useSelectedDetailInternal = ({
	initialSelectedDetail,
}: PropsWithChildren<{
	initialSelectedDetail?: string;
}>) => {
	const [_, setCookie, removeCookie] = useExpertCookies([
		selectedDetailCookieName,
	]);
	const [selectedDetail, realSetSelectedDetail] = useState<string | undefined>(
		initialSelectedDetail,
	);

	const setSelectedDetail = useCallback(
		(newSelected?: string) => {
			realSetSelectedDetail((oldSelectedDetail) => {
				const detailToSave =
					newSelected === oldSelectedDetail ? undefined : newSelected;

				if (detailToSave) {
					setCookie(selectedDetailCookieName, detailToSave);
				} else {
					removeCookie(selectedDetailCookieName);
				}

				return detailToSave;
			});
		},
		[setCookie, removeCookie],
	);

	return {
		selectedDetail,
		setSelectedDetail,
	};
};

export const [
	InnerSelectedDetailProvider,
	useSelectedDetail,
	useSetSelectedDetail,
] = constate(
	useSelectedDetailInternal,
	(v) => v.selectedDetail,
	(v) => v.setSelectedDetail,
);

export const SelectedDetailProvider: FC<PropsWithChildren<unknown>> = ({
	children,
}) => {
	const [cookies, setCookie] = useExpertCookies([selectedDetailCookieName], {
		doNotParse: true,
	});
	const savedSelectedDetail = cookies.selectedDetail;
	const hash = useLocation().hash?.slice(1);
	if (hash) {
		window.location.href = '';
		setCookie(selectedDetailCookieName, hash);
	}

	return (
		<InnerSelectedDetailProvider
			initialSelectedDetail={hash || savedSelectedDetail}
		>
			{children}
		</InnerSelectedDetailProvider>
	);
};
