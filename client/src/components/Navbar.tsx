import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

/* ── Custom AI Logo Icon ── */
const AILogo = ({ size = 14, active = false }: { size?: number; active?: boolean }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
		style={{ flexShrink: 0, transition: 'filter 0.3s' }}
	>
		{/* Outer hexagon */}
		<path
			d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z"
			stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.45)'}
			strokeWidth="1"
			fill={active ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.03)'}
			style={{ transition: 'all 0.3s' }}
		/>
		{/* Neural node center */}
		<circle cx="12" cy="12" r="2" fill={active ? '#c9a84c' : 'rgba(201,168,76,0.6)'} style={{ transition: 'all 0.3s' }} />
		{/* Neural lines */}
		<line x1="12" y1="10" x2="12" y2="5" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		<line x1="12" y1="14" x2="12" y2="19" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		<line x1="10.27" y1="11" x2="6" y2="8.5" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		<line x1="13.73" y1="13" x2="18" y2="15.5" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		<line x1="13.73" y1="11" x2="18" y2="8.5" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		<line x1="10.27" y1="13" x2="6" y2="15.5" stroke={active ? '#c9a84c' : 'rgba(201,168,76,0.4)'} strokeWidth="0.75" />
		{/* Outer nodes */}
		<circle cx="12" cy="4.5" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
		<circle cx="12" cy="19.5" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
		<circle cx="5.5" cy="8.25" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
		<circle cx="18.5" cy="15.75" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
		<circle cx="18.5" cy="8.25" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
		<circle cx="5.5" cy="15.75" r="1" fill={active ? '#e8c97a' : 'rgba(201,168,76,0.5)'} style={{ transition: 'all 0.3s' }} />
	</svg>
);

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === 'admin';
	const { cart } = useCartStore();
	const location = useLocation();

	const isAI = location.pathname === '/ai-chat';

	const navLink = (to: string, label: string) => {
		const active = location.pathname === to;
		return (
			<Link
				to={to}
				style={{
					position: 'relative',
					color: active ? '#c9a84c' : 'rgba(245,245,240,0.5)',
					fontSize: '0.67rem',
					letterSpacing: '0.2em',
					textTransform: 'uppercase',
					fontFamily: 'DM Sans, sans-serif',
					fontWeight: 500,
					transition: 'color 0.3s',
					textDecoration: 'none',
					paddingBottom: '3px',
				}}
				onMouseEnter={e => {
					(e.currentTarget as HTMLElement).style.color = '#c9a84c';
					const line = (e.currentTarget as HTMLElement).querySelector('.nav-ul') as HTMLElement;
					if (line) line.style.transform = 'scaleX(1)';
				}}
				onMouseLeave={e => {
					(e.currentTarget as HTMLElement).style.color = active ? '#c9a84c' : 'rgba(245,245,240,0.5)';
					const line = (e.currentTarget as HTMLElement).querySelector('.nav-ul') as HTMLElement;
					if (line && !active) line.style.transform = 'scaleX(0)';
				}}
			>
				{label}
				<span className="nav-ul" style={{
					display: 'block',
					position: 'absolute',
					bottom: 0,
					left: '50%',
					translateX: '-50%',
					height: '1px',
					width: '100%',
					background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
					transform: active ? 'scaleX(1)' : 'scaleX(0)',
					transformOrigin: 'center',
					transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
				}} />
			</Link>
		);
	};

	/* small gold diamond */
	const Sep = () => (
		<span style={{
			display: 'inline-block', width: 3, height: 3,
			background: 'rgba(201,168,76,0.28)', transform: 'rotate(45deg)', flexShrink: 0,
		}} />
	);

	return (
		<>
			<style>{`
				@keyframes shimmer-logo {
					0%   { background-position: -300% center; }
					100% { background-position: 300% center; }
				}
				@keyframes ai-pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50%       { opacity: 0.7; transform: scale(0.92); }
				}
				@keyframes fadein-nav {
					from { opacity: 0; transform: translateY(-6px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes orbit {
					from { transform: rotate(0deg); }
					to   { transform: rotate(360deg); }
				}

				.luxe-logo-text {
					background: linear-gradient(90deg, #7a5c20, #c9a84c, #f0d98a, #fff5cc, #e8c97a, #c9a84c, #7a5c20);
					background-size: 350% auto;
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
					animation: shimmer-logo 5s linear infinite;
				}
				.luxe-logo-text:hover { animation-duration: 1.8s; }

				.ai-nav-btn {
					position: relative;
					display: flex;
					align-items: center;
					gap: 7px;
					padding: 6px 14px 6px 10px;
					border: 1px solid rgba(201,168,76,0.2);
					border-radius: 2px;
					background: rgba(201,168,76,0.04);
					color: rgba(245,245,240,0.55);
					font-size: 0.65rem;
					letter-spacing: 0.18em;
					text-transform: uppercase;
					font-weight: 500;
					text-decoration: none;
					transition: all 0.3s ease;
					overflow: hidden;
				}
				.ai-nav-btn::before {
					content: '';
					position: absolute;
					inset: 0;
					background: linear-gradient(135deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.06) 100%);
					opacity: 0;
					transition: opacity 0.3s;
				}
				.ai-nav-btn:hover::before { opacity: 1; }
				.ai-nav-btn:hover {
					border-color: rgba(201,168,76,0.55);
					color: #c9a84c;
					box-shadow: 0 0 20px rgba(201,168,76,0.12), inset 0 0 12px rgba(201,168,76,0.04);
				}
				.ai-nav-btn.active {
					border-color: rgba(201,168,76,0.5);
					color: #c9a84c;
					background: rgba(201,168,76,0.08);
					box-shadow: 0 0 24px rgba(201,168,76,0.15), inset 0 0 16px rgba(201,168,76,0.05);
				}
				.ai-nav-btn.active .ai-logo-wrap {
					animation: ai-pulse 2.4s ease-in-out infinite;
					filter: drop-shadow(0 0 4px rgba(201,168,76,0.6));
				}

				.nav-pill-btn {
					display: flex; align-items: center; gap: 5px;
					padding: 7px 18px;
					font-size: 0.62rem; letter-spacing: 0.15em;
					text-transform: uppercase; font-weight: 600;
					text-decoration: none; border-radius: 1px;
					transition: all 0.25s ease; cursor: pointer;
				}
				.nav-pill-gold {
					background: linear-gradient(135deg, #a87828, #c9a84c, #e0b85a);
					color: #0a0600;
					border: 1px solid transparent;
				}
				.nav-pill-gold:hover {
					background: linear-gradient(135deg, #c9a84c, #e8c97a, #f5e09a);
					box-shadow: 0 0 22px rgba(201,168,76,0.35);
				}
				.nav-pill-outline {
					background: transparent;
					border: 1px solid rgba(201,168,76,0.2);
					color: rgba(245,245,240,0.55);
				}
				.nav-pill-outline:hover {
					border-color: rgba(201,168,76,0.55);
					color: #c9a84c;
					background: rgba(201,168,76,0.05);
				}
				.nav-pill-danger {
					background: transparent;
					border: 1px solid rgba(255,255,255,0.07);
					color: rgba(245,245,240,0.38);
				}
				.nav-pill-danger:hover {
					border-color: rgba(200,50,50,0.45);
					color: #e05555;
					background: rgba(200,50,50,0.05);
				}
				.nav-admin-btn {
					display: flex; align-items: center; gap: 5px;
					padding: 7px 16px;
					font-size: 0.6rem; letter-spacing: 0.16em;
					text-transform: uppercase; font-weight: 600;
					text-decoration: none; border-radius: 1px;
					border: 1px solid rgba(201,168,76,0.35);
					color: #c9a84c;
					background: rgba(201,168,76,0.05);
					transition: all 0.25s ease;
				}
				.nav-admin-btn:hover {
					background: #c9a84c; color: #000;
					box-shadow: 0 0 18px rgba(201,168,76,0.3);
				}

				.nav-wrap { animation: fadein-nav 0.55s ease forwards; }
			`}</style>

			<header className="nav-wrap" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50 }}>

				{/* ── Top accent line ── */}
				<div style={{
					height: 1,
					background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.12) 20%, rgba(201,168,76,0.55) 45%, #e8c97a 50%, rgba(201,168,76,0.55) 55%, rgba(201,168,76,0.12) 80%, transparent 100%)',
				}} />

				{/* ── Main bar ── */}
				<div style={{
					background: 'linear-gradient(180deg, rgba(7,5,3,0.98) 0%, rgba(11,8,5,0.97) 55%, rgba(15,11,7,0.95) 100%)',
					backdropFilter: 'blur(28px) saturate(1.5)',
					WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
					borderBottom: '1px solid rgba(201,168,76,0.14)',
					boxShadow: '0 2px 60px rgba(0,0,0,0.92), inset 0 -1px 0 rgba(201,168,76,0.05)',
				}}>
					<div style={{
						maxWidth: 1340, margin: '0 auto', padding: '0 36px',
						height: 76,
						display: 'flex', alignItems: 'center', justifyContent: 'space-between',
					}}>

						{/* ── Logo ── */}
						<Link to='/' style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
							<span className="luxe-logo-text" style={{
								fontFamily: 'Cormorant Garamond, serif',
								fontSize: '1.75rem',
								fontWeight: 700,
								letterSpacing: '0.24em',
								lineHeight: 1,
							}}>
								Aura Fashion
							</span>
							<span style={{
								fontSize: '0.5rem',
								letterSpacing: '0.36em',
								textTransform: 'uppercase',
								color: 'rgba(201,168,76,0.3)',
								fontFamily: 'DM Sans, sans-serif',
								fontWeight: 400,
								lineHeight: 1,
							}}>
								Haute Couture
							</span>
						</Link>

						{/* ── Center nav ── */}
						<nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
							{navLink('/', 'Home')}

							<Sep />

							{/* AI link with custom logo */}
							<Link to='/ai-chat' className={`ai-nav-btn${isAI ? ' active' : ''}`}>
								<span className="ai-logo-wrap" style={{ display: 'flex', alignItems: 'center' }}>
									<AILogo size={16} active={isAI} />
								</span>
								<span style={{ fontFamily: 'DM Sans, sans-serif' }}>Lumière AI</span>
								{/* live indicator dot */}
								<span style={{
									width: 4, height: 4, borderRadius: '50%',
									background: isAI ? '#c9a84c' : 'rgba(201,168,76,0.35)',
									boxShadow: isAI ? '0 0 6px rgba(201,168,76,0.9)' : 'none',
									marginLeft: 2,
									transition: 'all 0.3s',
									animation: isAI ? 'ai-pulse 2s ease-in-out infinite' : 'none',
								}} />
							</Link>
						</nav>

						{/* ── Right actions ── */}
						<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

							{user && (
								<>
									<Link to='/cart' style={{
										position: 'relative',
										color: 'rgba(245,245,240,0.45)',
										transition: 'color 0.3s',
										textDecoration: 'none',
										display: 'flex', alignItems: 'center',
										padding: '7px',
										border: '1px solid rgba(255,255,255,0.06)',
										borderRadius: 1,
									}}
										onMouseEnter={e => {
											(e.currentTarget as HTMLElement).style.color = '#c9a84c';
											(e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
											(e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.05)';
										}}
										onMouseLeave={e => {
											(e.currentTarget as HTMLElement).style.color = 'rgba(245,245,240,0.45)';
											(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
											(e.currentTarget as HTMLElement).style.background = 'transparent';
										}}
									>
										<ShoppingCart size={16} strokeWidth={1.4} />
										{cart.length > 0 && (
											<span style={{
												position: 'absolute', top: -5, right: -5,
												background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
												color: '#000',
												borderRadius: '50%', width: 16, height: 16,
												fontSize: '0.5rem', fontWeight: 800,
												display: 'flex', alignItems: 'center', justifyContent: 'center',
												boxShadow: '0 0 10px rgba(201,168,76,0.6)',
											}}>
												{cart.length}
											</span>
										)}
									</Link>

									<div style={{ width: 1, height: 22, background: 'rgba(201,168,76,0.1)' }} />
								</>
							)}

							{isAdmin && (
								<Link to='/secret-dashboard' className="nav-admin-btn">
									<Lock size={10} strokeWidth={1.5} />
									Maison
								</Link>
							)}

							{user ? (
								<button onClick={logout} className="nav-pill-btn nav-pill-danger">
									<LogOut size={11} strokeWidth={1.5} />
									<span className='hidden sm:inline'>Leave</span>
								</button>
							) : (
								<div style={{ display: 'flex', gap: 8 }}>
									<Link to='/login' className="nav-pill-btn nav-pill-outline">
										<LogIn size={11} strokeWidth={1.5} />
										Enter
									</Link>
									<Link to='/signup' className="nav-pill-btn nav-pill-gold">
										<UserPlus size={11} strokeWidth={1.5} />
										Join
									</Link>
								</div>
							)}
						</div>

					</div>
				</div>

				{/* ── Bottom glow echo ── */}
				<div style={{
					height: 1,
					background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.03) 30%, rgba(201,168,76,0.07) 50%, rgba(201,168,76,0.03) 70%, transparent 100%)',
				}} />

			</header>
		</>
	);
};

export default Navbar;
