import toast from 'react-hot-toast';
import { ShoppingCart, Plus } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

interface Product {
	_id: string; name: string; description: string;
	price: number; image: string; category: string; isFeatured: boolean;
}

const ProductCard = ({ product }: { product: Product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();

	const handleAddToCart = () => {
		if (!user) { toast.error('Please login to add products to cart', { id: 'login' }); return; }
		addToCart(product);
	};

	return (
		<div style={{
			background: '#0a0a0a', border: '1px solid #1e1e1e',
			overflow: 'hidden', transition: 'all 0.3s ease', position: 'relative',
		}}
			onMouseEnter={e => {
				(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.35)';
				(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.7)';
			}}
			onMouseLeave={e => {
				(e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e';
				(e.currentTarget as HTMLElement).style.boxShadow = 'none';
			}}
		>
			{/* Image */}
			<div style={{ position: 'relative', height: 260, overflow: 'hidden', background: '#111' }}>
				<img
					src={product.image} alt={product.name}
					style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
					onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
					onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
				/>
				{product.isFeatured && (
					<div style={{
						position: 'absolute', top: 12, left: 12,
						background: 'var(--gold)', color: '#000',
						fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
						textTransform: 'uppercase', padding: '3px 8px',
					}}>
						Featured
					</div>
				)}
			</div>

			{/* Body */}
			<div style={{ padding: '20px' }}>
				<p style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
					{product.category}
				</p>
				<h5 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 600, color: '#f5f5f0', margin: '0 0 16px', lineHeight: 1.3 }}>
					{product.name}
				</h5>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', fontWeight: 500, color: '#f5f5f0' }}>
						${product.price}
					</span>
					<button
						onClick={handleAddToCart}
						style={{
							display: 'flex', alignItems: 'center', gap: 6,
							background: 'var(--gold)', color: '#000',
							border: 'none', padding: '8px 16px', cursor: 'pointer',
							fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
							transition: 'all 0.2s',
						}}
						onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e8c97a'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(201,168,76,0.3)'; }}
						onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
					>
						<Plus size={14} />
						Add
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
