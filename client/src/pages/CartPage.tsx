import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought';
import OrderSummary from '../components/OrderSummary';
import GiftCouponCard from '../components/GiftCouponCard';

const CartPage = () => {
	const { cart } = useCartStore();

	return (
		<div className='py-8 md:py-16'>
			<div className='mx-auto max-w-screen-xl px-4 2xl:px-0'>
				<div className='mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8'>
					<motion.div
						className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						{cart.length === 0 ? (
							<EmptyCartUI />
						) : (
							<div className='space-y-6'>
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}
						{cart.length > 0 && <PeopleAlsoBought />}
					</motion.div>

					{cart.length > 0 && (
						<motion.div
							className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<OrderSummary />
							<GiftCouponCard />
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CartPage;

const EmptyCartUI = () => (
	<motion.div
		style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '64px 0' }}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<ShoppingCart style={{ height: 80, width: 80, color: 'rgba(201,168,76,0.25)' }} />
		<h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(245,245,240,0.7)', margin: 0 }}>
			Your cart is empty
		</h3>
		<p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(245,245,240,0.35)', letterSpacing: '0.04em', margin: 0 }}>
			Looks like you haven&apos;t added anything to your cart yet.
		</p>
		<Link
			to='/'
			style={{
				marginTop: 8,
				padding: '11px 28px',
				background: 'rgba(201,168,76,0.1)',
				border: '1px solid rgba(201,168,76,0.35)',
				borderRadius: 2,
				color: '#c9a84c',
				fontFamily: 'DM Sans, sans-serif',
				fontSize: '0.68rem',
				fontWeight: 600,
				letterSpacing: '0.2em',
				textTransform: 'uppercase',
				textDecoration: 'none',
				transition: 'background 0.3s',
			}}
		>
			Start Shopping
		</Link>
	</motion.div>
);
