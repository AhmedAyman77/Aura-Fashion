import { motion } from 'framer-motion';
import { Trash, Star } from 'lucide-react';
import { useProductStore } from '../stores/useProductStore';

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

	return (
		<motion.div
			style={{
				border: '1px solid rgba(201,168,76,0.15)',
				borderRadius: 2,
				overflow: 'hidden',
				maxWidth: '4xl',
				margin: '0 auto',
				background: 'rgba(245,245,240,0.01)',
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ borderBottom: '1px solid rgba(201,168,76,0.12)', background: 'rgba(201,168,76,0.04)' }}>
						{['Product', 'Price', 'Category', 'Featured', 'Actions'].map((heading) => (
							<th
								key={heading}
								scope='col'
								style={{
									padding: '14px 24px',
									textAlign: 'left',
									fontFamily: 'DM Sans, sans-serif',
									fontSize: '0.65rem',
									fontWeight: 600,
									letterSpacing: '0.2em',
									textTransform: 'uppercase',
									color: 'rgba(201,168,76,0.55)',
								}}
							>
								{heading}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{products.map((product, idx) => (
						<tr
							key={product._id}
							style={{
								borderBottom: '1px solid rgba(201,168,76,0.07)',
								background: idx % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.015)',
								transition: 'background 0.2s',
							}}
							onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.04)')}
							onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.015)')}
						>
							<td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
									<img
										style={{
											height: 40,
											width: 40,
											borderRadius: '50%',
											objectFit: 'cover',
											border: '1px solid rgba(201,168,76,0.15)',
										}}
										src={product.image}
										alt={product.name}
									/>
									<span style={{
										fontFamily: 'DM Sans, sans-serif',
										fontSize: '0.85rem',
										color: 'rgba(245,245,240,0.8)',
										letterSpacing: '0.02em',
									}}>
										{product.name}
									</span>
								</div>
							</td>
							<td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
								<span style={{
									fontFamily: 'Cormorant Garamond, serif',
									fontSize: '0.95rem',
									color: '#c9a84c',
									letterSpacing: '0.04em',
								}}>
									${product.price.toFixed(2)}
								</span>
							</td>
							<td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
								<span style={{
									fontFamily: 'DM Sans, sans-serif',
									fontSize: '0.78rem',
									color: 'rgba(245,245,240,0.4)',
									letterSpacing: '0.06em',
								}}>
									{product.category}
								</span>
							</td>
							<td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									style={{
										padding: 6,
										borderRadius: '50%',
										border: product.isFeatured ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(245,245,240,0.1)',
										background: product.isFeatured ? 'rgba(201,168,76,0.15)' : 'transparent',
										color: product.isFeatured ? '#c9a84c' : 'rgba(245,245,240,0.25)',
										cursor: 'pointer',
										transition: 'all 0.2s',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Star style={{ height: 16, width: 16, fill: product.isFeatured ? '#c9a84c' : 'none' }} />
								</button>
							</td>
							<td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
								<button
									onClick={() => deleteProduct(product._id)}
									style={{
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										color: 'rgba(200,70,70,0.6)',
										transition: 'color 0.2s',
										display: 'flex',
										alignItems: 'center',
									}}
									onMouseEnter={e => (e.currentTarget.style.color = 'rgba(220,80,80,1)')}
									onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,70,70,0.6)')}
								>
									<Trash style={{ height: 16, width: 16 }} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default ProductsList;
