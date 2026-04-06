import { ArrowLeft, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PurchaseCancelPage = () => {
	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{
					maxWidth: 440,
					width: '100%',
					background: 'rgba(245,245,240,0.02)',
					border: '1px solid rgba(180,60,60,0.2)',
					borderRadius: 2,
					overflow: 'hidden',
					position: 'relative',
					zIndex: 10,
					backdropFilter: 'blur(8px)',
				}}
			>
				{/* Red top bar */}
				<div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(200,70,70,0.8), transparent)' }} />

				<div style={{ padding: '40px 32px 36px' }}>
					{/* Icon */}
					<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
						<div style={{
							width: 64,
							height: 64,
							borderRadius: '50%',
							border: '1px solid rgba(180,60,60,0.3)',
							background: 'rgba(180,60,60,0.05)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
							<XCircle style={{ color: 'rgba(210,70,70,0.85)', width: 28, height: 28 }} />
						</div>
					</div>

					{/* Heading */}
					<h1 style={{
						fontFamily: 'Cormorant Garamond, serif',
						fontSize: '2rem',
						fontWeight: 600,
						letterSpacing: '0.08em',
						textAlign: 'center',
						color: 'rgba(210,70,70,0.85)',
						margin: '0 0 10px',
					}}>
						Purchase Cancelled
					</h1>

					<p style={{
						fontFamily: 'DM Sans, sans-serif',
						fontSize: '0.82rem',
						color: 'rgba(245,245,240,0.4)',
						textAlign: 'center',
						letterSpacing: '0.03em',
						lineHeight: 1.7,
						marginBottom: 28,
					}}>
						Your order has been cancelled. No charges have been made.
					</p>

					{/* Info box */}
					<div style={{
						border: '1px solid rgba(180,60,60,0.12)',
						borderRadius: 2,
						padding: '16px 20px',
						marginBottom: 24,
						background: 'rgba(180,60,60,0.03)',
					}}>
						<p style={{
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '0.75rem',
							color: 'rgba(245,245,240,0.3)',
							textAlign: 'center',
							letterSpacing: '0.04em',
							lineHeight: 1.7,
							margin: 0,
						}}>
							If you encountered any issues during checkout, please don't hesitate to contact our support team.
						</p>
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
							background: 'rgba(245,245,240,0.03)',
							border: '1px solid rgba(245,245,240,0.1)',
							borderRadius: 2,
							color: 'rgba(245,245,240,0.5)',
							fontFamily: 'DM Sans, sans-serif',
							fontSize: '0.68rem',
							fontWeight: 600,
							letterSpacing: '0.2em',
							textTransform: 'uppercase',
							textDecoration: 'none',
							transition: 'border-color 0.3s, color 0.3s',
							boxSizing: 'border-box',
						}}
					>
						<ArrowLeft size={14} />
						Return to Shop
					</Link>
				</div>
			</motion.div>
		</div>
	);
};

export default PurchaseCancelPage;
