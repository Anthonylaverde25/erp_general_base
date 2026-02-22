import axiosInstance from '@/lib/@axios';
import { lazy, useEffect } from 'react';

const NumberSeriesTabView = lazy(() => import('../components/NumberSeriesTabView'));

export default function NumberSeriesPage() {
	useEffect(() => {
		const fetch = async () => {
			const response = await axiosInstance.get('/number-series');
			console.log(response.data);
		};
		fetch();
	}, []);
	return <NumberSeriesTabView />;
}
