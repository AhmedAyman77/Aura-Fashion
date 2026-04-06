import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCartStore } from '../stores/useCartStore';

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState('');
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => { getMyCoupon(); }, [getMyCoupon]);
	useEffect(() => { if (coupon) setUserInputCode(coupon.code); }, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode('');
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
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<label style={{
				display: 'block',
				marginBottom: 10,
				fontFamily: 'DM Sans, sans-serif',
				fontSize: '0.72rem',
				letterSpacing: '0.15em',
				textTransform: 'uppercase',
				color: 'rgba(245,245,240,0.4)',
			}}>
				Voucher or Gift Card
			</label>
			<input
				type='text'
				style={{
					width: '100%',
					padding: '10px 14px',
					background: 'rgba(245,245,240,0.03)',
					border: '1px solid rgba(201,168,76,0.2)',
					borderRadius: 2,
					color: 'rgba(245,245,240,0.85)',
					fontFamily: 'DM Sans, sans-serif',
					fontSize: '0.85rem',
					letterSpacing: '0.1em',
					outline: 'none',
					marginBottom: 12,
					boxSizing: 'border-box',
					transition: 'border-color 0.2s',
				}}
				placeholder='Enter code here'
				value={userInputCode}
				onChange={(e) => setUserInputCode(e.target.value)}
				onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
				onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
			/>

			<motion.button
				style={{
					width: '100%',
					padding: '11px 20px',
					background: 'rgba(201,168,76,0.08)',
					border: '1px solid rgba(201,168,76,0.35)',
					borderRadius: 2,
					color: '#c9a84c',
					fontFamily: 'DM Sans, sans-serif',
					fontSize: '0.68rem',
					fontWeight: 600,
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					cursor: 'pointer',
					transition: 'all 0.3s',
				}}
				whileHover={{ background: 'rgba(201,168,76,0.15)' }}
				whileTap={{ scale: 0.98 }}
				onClick={handleApplyCoupon}
			>
				Apply Code
			</motion.button>

			{isCouponApplied && coupon && (
				<div style={{ marginTop: 16 }}>
					<p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'rgba(245,245,240,0.5)', marginBottom: 6 }}>
						Applied: <span style={{ color: '#c9a84c' }}>{coupon.code}</span> — {coupon.discountPercentage}% off
					</p>
					<motion.button
						style={{
							width: '100%',
							padding: '9px 20px',
							background: 'rgba(180,60,60,0.08)',
							border: '1px solid rgba(180,60,60,0.25)',
							borderRadius: 2,
							color: 'rgba(210,80,80,0.8)',
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '0.68rem',
							fontWeight: 600,
							letterSpacing: '0.15em',
							textTransform: 'uppercase',
							cursor: 'pointer',
						}}
						whileHover={{ background: 'rgba(180,60,60,0.15)' }}
						whileTap={{ scale: 0.98 }}
						onClick={handleRemoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && !isCouponApplied && (
				<div style={{ marginTop: 14 }}>
					<p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(245,245,240,0.35)', letterSpacing: '0.05em' }}>
						Available: <span style={{ color: 'rgba(201,168,76,0.7)' }}>{coupon.code}</span> — {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;
