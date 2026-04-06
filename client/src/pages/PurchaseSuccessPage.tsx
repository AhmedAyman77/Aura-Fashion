import { ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import axiosInstance from '../lib/axios';
import Confetti from 'react-confetti';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { clearCart } = useCartStore();

	useEffect(() => {
		const handleCheckoutSuccess = async (sessionId: string) => {
			try {
				await axiosInstance.post('/payments/success', { sessionId });
				clearCart();
			} catch (error) {
				const err = error as AxiosError<{ message: string }>;
				setError(err.response?.data?.message || 'Something went wrong processing your order');
			} finally {
				setIsProcessing(false);
			}
		};

		const sessionId = new URLSearchParams(window.location.search).get('session_id');
		if (sessionId) {
			handleCheckoutSuccess(sessionId);
		} else {
			setIsProcessing(false);
			setError('No session ID found in the URL');
		}
	}, []);

	if (isProcessing) return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'rgba(245,245,240,0.5)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase' }}>
			Processing your order...
		</div>
	);

	if (error) return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'rgba(200,80,80,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
			{error}
		</div>
	);

	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={500}
				recycle={false}
				colors={['#c9a84c', '#e8c97a', '#f5f5f0', '#a08030', '#ffffff']}
			/>

			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				style={{
					maxWidth: 440,
					width: '100%',
					background: 'rgba(245,245,240,0.02)',
					border: '1px solid rgba(201,168,76,0.2)',
					borderRadius: 2,
					overflow: 'hidden',
					position: 'relative',
					zIndex: 10,
					backdropFilter: 'blur(8px)',
				}}
			>
				{/* Gold top bar */}
				<div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />

				<div style={{ padding: '40px 32px 36px' }}>
					{/* Icon */}
					<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
						<div style={{
							width: 64,
							height: 64,
							borderRadius: '50%',
							border: '1px solid rgba(201,168,76,0.3)',
							background: 'rgba(201,168,76,0.06)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<CheckCircle style={{ color: '#c9a84c', width: 28, height: 28 }} />
						</div>
					</div>

					{/* Heading */}
					<h1 style={{
						fontFamily: 'Cormorant Garamond, serif',
						fontSize: '2rem',
						fontWeight: 600,
						letterSpacing: '0.08em',
						textAlign: 'center',
						background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						margin: '0 0 10px',
					}}>
						Purchase Successful
					</h1>

					<p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'rgba(245,245,240,0.45)', textAlign: 'center', letterSpacing: '0.04em', marginBottom: 6 }}>
						Thank you for your order. We're processing it now.
					</p>
					<p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'rgba(201,168,76,0.55)', textAlign: 'center', letterSpacing: '0.06em', marginBottom: 28 }}>
						Check your email for order details and updates.
					</p>

					{/* Order details */}
					<div style={{
						border: '1px solid rgba(201,168,76,0.1)',
						borderRadius: 2,
						padding: '16px 20px',
						marginBottom: 24,
						background: 'rgba(201,168,76,0.03)',
					}}>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
							<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(245,245,240,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order number</span>
							<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', color: '#c9a84c', letterSpacing: '0.06em' }}>#12345</span>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(245,245,240,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Est. delivery</span>
							<span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', color: '#c9a84c', letterSpacing: '0.06em' }}>3–5 business days</span>
						</div>
					</div>

					{/* CTA */}
					<Link
						to='/'
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 8,
							width: '100%',
							padding: '12px 20px',
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
							boxSizing: 'border-box',
						}}
					>
						Continue Shopping
						<ArrowRight size={14} />
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseSuccessPage;
