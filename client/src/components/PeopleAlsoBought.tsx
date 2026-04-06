import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';
import { AxiosError } from 'axios';

interface Product {
	_id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	isFeatured: boolean;
}

const PeopleAlsoBought = () => {
	const [recommendations, setRecommendations] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const res = await axiosInstance.get<Product[]>('/products/recommendations');
				setRecommendations(res.data);
			} catch (error) {
				const err = error as AxiosError<{ message: string }>;
				toast.error(err.response?.data?.message || 'An error occurred while fetching recommendations');
			} finally {
				setIsLoading(false);
			}
		};
		fetchRecommendations();
	}, []);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div style={{ marginTop: 40 }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
				<div style={{ height: 1, width: 20, background: 'rgba(201,168,76,0.4)' }} />
				<h3 style={{
					fontFamily: 'Cormorant Garamond, serif',
					fontSize: '1.4rem',
					fontWeight: 600,
					letterSpacing: '0.08em',
					color: '#c9a84c',
					margin: 0,
				}}>
					People also bought
				</h3>
				<div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{recommendations.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;
