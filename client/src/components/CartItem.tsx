import { Minus, Plus, Trash } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

interface CartItemType {
	_id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	quantity: number;
}

interface CartItemProps {
	item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div style={{
			borderRadius: 2,
			border: '1px solid rgba(201,168,76,0.15)',
			background: 'rgba(245,245,240,0.02)',
			padding: '24px',
			backdropFilter: 'blur(4px)',
		}}>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				<div className='shrink-0 md:order-1'>
					<img
						className='h-20 md:h-32 rounded object-cover'
						style={{ border: '1px solid rgba(201,168,76,0.1)' }}
						src={item.image}
						alt={item.name}
					/>
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					<div className='flex items-center gap-2'>
						<button
							style={{
								display: 'inline-flex',
								height: 28,
								width: 28,
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 2,
								border: '1px solid rgba(201,168,76,0.2)',
								background: 'rgba(201,168,76,0.05)',
								cursor: 'pointer',
								transition: 'all 0.2s',
								color: 'rgba(245,245,240,0.6)',
							}}
							onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
							onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus size={12} />
						</button>
						<p style={{ color: 'rgba(245,245,240,0.8)', fontFamily: 'DM Sans, sans-serif', minWidth: 20, textAlign: 'center' }}>{item.quantity}</p>
						<button
							style={{
								display: 'inline-flex',
								height: 28,
								width: 28,
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: 2,
								border: '1px solid rgba(201,168,76,0.2)',
								background: 'rgba(201,168,76,0.05)',
								cursor: 'pointer',
								transition: 'all 0.2s',
								color: 'rgba(245,245,240,0.6)',
							}}
							onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)')}
							onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)')}
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus size={12} />
						</button>
					</div>

					<div className='text-end md:order-4 md:w-32'>
						<p style={{ fontSize: '1rem', fontWeight: 600, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.04em' }}>
							${item.price}
						</p>
					</div>
				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(245,245,240,0.9)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.02em' }}>
						{item.name}
					</p>
					<p style={{ fontSize: '0.8rem', color: 'rgba(245,245,240,0.38)', fontFamily: 'DM Sans, sans-serif' }}>{item.description}</p>

					<div className='flex items-center gap-4'>
						<button
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								fontSize: '0.8rem',
								color: 'rgba(201,100,100,0.7)',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								transition: 'color 0.2s',
							}}
							onMouseEnter={e => (e.currentTarget.style.color = 'rgba(220,80,80,1)')}
							onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,100,100,0.7)')}
							onClick={() => removeFromCart(item._id)}
						>
							<Trash size={15} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
