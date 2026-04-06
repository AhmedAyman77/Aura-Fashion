import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryItem from '../components/CategoryItem';
import { useProductStore } from '../stores/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const categories = [
	{ href: '/jeans', name: 'Jeans', imageUrl: '/jeans.jpg' },
	{ href: '/t-shirts', name: 'T-shirts', imageUrl: '/tshirts.jpg' },
	{ href: '/shoes', name: 'Shoes', imageUrl: '/shoes.jpg' },
	{ href: '/glasses', name: 'Glasses', imageUrl: '/glasses.png' },
	{ href: '/jackets', name: 'Jackets', imageUrl: '/jackets.jpg' },
	{ href: '/suits', name: 'Suits', imageUrl: '/suits.jpg' },
	{ href: '/bags', name: 'Bags', imageUrl: '/bags.jpg' },
];

const HomePage = () => {
	const { fetchAllProducts, fetchFeaturedProducts, products, allProducts, loading, searchQuery, setSearchQuery } = useProductStore();
	const [isSearching, setIsSearching] = useState(false);
	const navigate = useNavigate();

	useEffect(() => { fetchAllProducts(); }, [fetchAllProducts]);
	useEffect(() => { fetchFeaturedProducts(); }, [fetchFeaturedProducts]);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setIsSearching(value.trim().length > 0);
	};

	const handleCategoryClick = (href: string) => {
		setSearchQuery(''); setIsSearching(false);
		navigate(`/category${href}`);
	};

	return (
		<div style={{ minHeight: '100vh', background: '#000' }}>

			{/* Hero */}
			<div style={{ position: 'relative', padding: '80px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
				{/* Decorative gold lines */}
				<div style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
				<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
					<p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>
						Premium Collection 2026
					</p>
					<h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, color: '#f5f5f0', margin: '0 0 8px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
						Elevate Your
					</h1>
					<h1 className='gold-shimmer' style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 600, margin: '0 0 24px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
						Wardrobe
					</h1>
					<p style={{ color: 'var(--white-dim)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.8 }}>
						Discover curated fashion that defines modern luxury. Each piece selected for those who demand excellence.
					</p>
					<div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '0 auto' }} />
				</motion.div>
			</div>

			{/* Main content */}
			<div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>

				{/* Search */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ marginBottom: 48 }}>
					<SearchBar value={searchQuery} onChange={handleSearchChange} placeholder='Search products...' />
				</motion.div>

				<AnimatePresence mode='wait'>
					{isSearching ? (
						<motion.div key='search' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
							<p style={{ color: 'var(--white-muted)', marginBottom: 32, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
								{products.length === 0 ? 'No products found' : `${products.length} result${products.length !== 1 ? 's' : ''} for "${searchQuery}"`}
							</p>
							{products.length === 0 ? (
								<div style={{ textAlign: 'center', padding: '80px 0' }}>
									<p style={{ color: 'var(--white-muted)' }}>Try a different search term.</p>
								</div>
							) : (
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
									{products.map(p => <ProductCard key={p._id} product={p} />)}
								</div>
							)}
						</motion.div>
					) : (
						<motion.div key='default' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
							{/* Category heading */}
							<div style={{ marginBottom: 32 }}>
								<p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
									Browse by
								</p>
								<h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 400, color: '#f5f5f0', margin: 0 }}>
									Categories
								</h2>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, marginBottom: 0 }}>
								{categories.map(category => (
									<div key={category.name} onClick={() => handleCategoryClick(category.href)} style={{ cursor: 'pointer' }}>
										<CategoryItem category={category} />
									</div>
								))}
							</div>

							{!loading && allProducts.length > 0 && (
								<FeaturedProducts featuredProducts={allProducts.filter(p => p.isFeatured)} />
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default HomePage;
