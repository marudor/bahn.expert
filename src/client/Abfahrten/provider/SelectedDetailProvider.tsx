import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import constate from '@/constate';
import { useLocation } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import type { FC, PropsWithChildren } from 'react';

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

	return [selectedDetail, setSelectedDetail] as const;
};

export const [InnerSelectedDetailProvider, useSelectedDetail] = constate(
	useSelectedDetailInternal,
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
