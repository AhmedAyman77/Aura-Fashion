import { useEffect } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const CategoryPage = () => {
	const {
		fetchProductsByCategory,
		products,
		loading,
		searchQuery,
		setSearchQuery,
		setActiveCategory,
	} = useProductStore();

	const { category } = useParams<{ category: string }>();

	useEffect(() => {
		if (category) {
			setActiveCategory(category);
			fetchProductsByCategory(category);
		}
		return () => {
			setActiveCategory(null);
			setSearchQuery('');
		};
	}, [category]);

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					style={{
						textAlign: 'center',
						fontFamily: 'Cormorant Garamond, serif',
						fontSize: 'clamp(2.5rem, 6vw, 4rem)',
						fontWeight: 600,
						letterSpacing: '0.12em',
						background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
						backgroundSize: '200% auto',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						marginBottom: 32,
					}}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
				</motion.h1>

				{/* Search bar */}
				<motion.div
					style={{ marginBottom: 36 }}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<SearchBar
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder={`Search in ${category ?? 'category'}...`}
					/>
					{searchQuery && (
						<p style={{
							textAlign: 'center',
							color: 'rgba(245,245,240,0.35)',
							marginTop: 10,
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '0.78rem',
							letterSpacing: '0.06em',
						}}>
							{products.length === 0
								? 'No products found'
								: `${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery}"`}
						</p>
					)}
				</motion.div>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
				>
					{!loading && products.length === 0 && (
						<h2 style={{
							fontFamily: 'Cormorant Garamond, serif',
							fontSize: '1.8rem',
							fontWeight: 400,
							color: 'rgba(245,245,240,0.3)',
							textAlign: 'center',
							gridColumn: '1 / -1',
							letterSpacing: '0.06em',
						}}>
							{searchQuery ? `No products match "${searchQuery}"` : 'No products found'}
						</h2>
					)}

					{products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryPage;
