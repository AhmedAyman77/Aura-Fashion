import { useEffect, useState } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

interface Product { _id: string; name: string; price: number; image: string; }

const FeaturedProducts = ({ featuredProducts }: { featuredProducts: Product[] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);
	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const nextSlide = () => setCurrentIndex(prev => prev + itemsPerPage);
	const prevSlide = () => setCurrentIndex(prev => prev - itemsPerPage);
	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	const navBtn = (onClick: () => void, disabled: boolean, children: React.ReactNode, side: 'left' | 'right') => (
		<button
			onClick={onClick}
			disabled={disabled}
			style={{
				position: 'absolute', top: '50%', [side]: -20,
				transform: 'translateY(-50%)',
				width: 40, height: 40,
				background: disabled ? '#1a1a1a' : '#000',
				border: `1px solid ${disabled ? '#1e1e1e' : 'var(--gold)'}`,
				color: disabled ? '#333' : 'var(--gold)',
				display: 'flex', alignItems: 'center', justifyContent: 'center',
				cursor: disabled ? 'not-allowed' : 'pointer',
				transition: 'all 0.2s',
				zIndex: 10,
			}}
		>
			{children}
		</button>
	);

	return (
		<div style={{ padding: '64px 0' }}>
			{/* Section header */}
			<div style={{ textAlign: 'center', marginBottom: 48 }}>
				<p style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>
					Curated Selection
				</p>
				<h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5rem', fontWeight: 400, color: '#f5f5f0', margin: 0 }}>
					Featured Pieces
				</h2>
				<div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', margin: '20px auto 0' }} />
			</div>

			<div style={{ position: 'relative' }}>
				<div style={{ overflow: 'hidden' }}>
					<div style={{ display: 'flex', transition: 'transform 0.4s ease', transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}>
						{featuredProducts.map((product) => (
							<div key={product._id} style={{ width: `${100 / itemsPerPage}%`, flexShrink: 0, padding: '0 8px' }}>
								<div style={{
									background: '#0a0a0a', border: '1px solid #1e1e1e',
									overflow: 'hidden', transition: 'all 0.3s',
								}}
									onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)'; }}
									onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; }}
								>
									<div style={{ overflow: 'hidden', height: 200 }}>
										<img
											src={product.image} alt={product.name}
											style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
											onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
											onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
										/>
									</div>
									<div style={{ padding: '16px' }}>
										<h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 600, color: '#f5f5f0', margin: '0 0 8px', lineHeight: 1.3 }}>
											{product.name}
										</h3>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<span style={{ color: 'var(--gold)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
												${product.price.toFixed(2)}
											</span>
											<button
												onClick={() => addToCart(product as any)}
												style={{
													background: 'transparent', border: '1px solid var(--gold)',
													color: 'var(--gold)', padding: '6px 12px', cursor: 'pointer',
													fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
													display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
												}}
												onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
												onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
											>
												<ShoppingCart size={12} />
												Add
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				{navBtn(prevSlide, isStartDisabled, <ChevronLeft size={18} />, 'left')}
				{navBtn(nextSlide, isEndDisabled, <ChevronRight size={18} />, 'right')}
			</div>
		</div>
	);
};

export default FeaturedProducts;
