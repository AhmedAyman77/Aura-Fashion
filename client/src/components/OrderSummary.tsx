import { motion } from 'framer-motion';
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface CheckoutSessionResponse {
	id: string;
	url: string;
	totalAmount: number;
}

const OrderSummary = () => {
	const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
	const [isLoading, setIsLoading] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			const res = await axiosInstance.post<CheckoutSessionResponse>('/payments/checkout', {
				products: cart,
				couponCode: coupon ? coupon.code : null,
			});
			if (!res.data.url) {
				toast.error('Failed to get checkout URL from Stripe.');
				return;
			}
			window.location.href = res.data.url;
		} catch (error: any) {
			const message = error?.response?.data?.message || error?.message || 'Checkout failed. Please try again.';
			toast.error(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			style={{
				borderRadius: 2,
				border: '1px solid rgba(201,168,76,0.18)',
				background: 'rgba(245,245,240,0.02)',
				padding: '24px',
				backdropFilter: 'blur(4px)',
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Title */}
			<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
				<div style={{ height: 1, width: 20, background: 'rgba(201,168,76,0.4)' }} />
				<p style={{
					fontFamily: 'Cormorant Garamond, serif',
					fontSize: '1.25rem',
					fontWeight: 600,
					letterSpacing: '0.08em',
					color: '#c9a84c',
					textTransform: 'uppercase',
					margin: 0,
				}}>
					Order Summary
				</p>
				<div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(245,245,240,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Original price</span>
					<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'rgba(245,245,240,0.75)' }}>${formattedSubtotal}</span>
				</div>

				{savings > 0 && (
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(245,245,240,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Savings</span>
						<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#c9a84c' }}>-${formattedSavings}</span>
					</div>
				)}

				{coupon && isCouponApplied && (
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(245,245,240,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Coupon ({coupon.code})</span>
						<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#c9a84c' }}>-{coupon.discountPercentage}%</span>
					</div>
				)}

				<div style={{ borderTop: '1px solid rgba(201,168,76,0.12)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
					<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 600, color: 'rgba(245,245,240,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
					<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '0.04em' }}>${formattedTotal}</span>
				</div>
			</div>

			<motion.button
				style={{
					width: '100%',
					padding: '12px 20px',
					background: 'rgba(201,168,76,0.12)',
					border: '1px solid rgba(201,168,76,0.4)',
					borderRadius: 2,
					color: '#c9a84c',
					fontFamily: 'DM Sans, sans-serif',
					fontSize: '0.72rem',
					fontWeight: 600,
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					cursor: isLoading ? 'not-allowed' : 'pointer',
					opacity: isLoading ? 0.6 : 1,
					transition: 'all 0.3s',
					marginBottom: 16,
				}}
				whileHover={{ background: 'rgba(201,168,76,0.2)' }}
				whileTap={{ scale: isLoading ? 1 : 0.98 }}
				onClick={handlePayment}
				disabled={isLoading}
			>
				{isLoading ? 'Redirecting...' : 'Proceed to Checkout'}
			</motion.button>

			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
				<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(245,245,240,0.3)' }}>or</span>
				<Link
					to='/'
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 6,
						fontFamily: 'DM Sans, sans-serif',
						fontSize: '0.75rem',
						letterSpacing: '0.1em',
						color: 'rgba(201,168,76,0.6)',
						textDecoration: 'none',
					}}
				>
					Continue Shopping
					<MoveRight size={13} />
				</Link>
			</div>
		</motion.div>
	);
};

export default OrderSummary;
