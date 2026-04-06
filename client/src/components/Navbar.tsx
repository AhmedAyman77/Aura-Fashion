import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Bot } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === 'admin';
	const { cart } = useCartStore();
	const location = useLocation();

	const navLink = (to: string, label: string) => {
		const active = location.pathname === to;
		return (
			<Link
				to={to}
				style={{
					color: active ? 'var(--gold)' : 'var(--white-dim)',
					fontSize: '0.75rem',
					letterSpacing: '0.1em',
					textTransform: 'uppercase',
					fontFamily: 'DM Sans, sans-serif',
					fontWeight: 500,
					transition: 'color 0.2s',
					textDecoration: 'none',
				}}
				onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
				onMouseLeave={e => (e.currentTarget.style.color = active ? 'var(--gold)' : 'var(--white-dim)')}
			>
				{label}
			</Link>
		);
	};

	return (
		<header style={{
			position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 40,
			background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)',
			borderBottom: '1px solid #1e1e1e',
		}}>
			<div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

				{/* Logo */}
				<Link to='/' style={{ textDecoration: 'none' }}>
					<span style={{
						fontFamily: 'Cormorant Garamond, serif',
						fontSize: '1.5rem',
						fontWeight: 600,
						letterSpacing: '0.05em',
						background: 'linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)',
						backgroundSize: '200% auto',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
					}}>
						LUXORA
					</span>
				</Link>

				{/* Nav links */}
				<nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
					{navLink('/', 'Home')}

					<Link
						to='/ai-chat'
						style={{
							display: 'flex', alignItems: 'center', gap: 6,
							color: location.pathname === '/ai-chat' ? 'var(--gold)' : 'var(--white-dim)',
							fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
							fontWeight: 500, transition: 'color 0.2s', textDecoration: 'none',
						}}
						onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
						onMouseLeave={e => (e.currentTarget.style.color = location.pathname === '/ai-chat' ? 'var(--gold)' : 'var(--white-dim)')}
					>
						<Bot size={14} />
						<span>AI</span>
					</Link>

					{user && (
						<Link to='/cart' style={{ position: 'relative', color: 'var(--white-dim)', transition: 'color 0.2s', textDecoration: 'none' }}
							onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
							onMouseLeave={e => (e.currentTarget.style.color = 'var(--white-dim)')}>
							<ShoppingCart size={18} />
							{cart.length > 0 && (
								<span style={{
									position: 'absolute', top: -8, right: -8,
									background: 'var(--gold)', color: '#000',
									borderRadius: '50%', width: 16, height: 16,
									fontSize: '0.6rem', fontWeight: 700,
									display: 'flex', alignItems: 'center', justifyContent: 'center',
								}}>
									{cart.length}
								</span>
							)}
						</Link>
					)}

					{isAdmin && (
						<Link to='/secret-dashboard' style={{
							display: 'flex', alignItems: 'center', gap: 6,
							padding: '6px 14px', border: '1px solid var(--gold)',
							color: 'var(--gold)', borderRadius: 2,
							fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
							fontWeight: 600, transition: 'all 0.2s', textDecoration: 'none',
						}}
							onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
							onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
						>
							<Lock size={12} />
							Admin
						</Link>
					)}

					{user ? (
						<button onClick={logout} style={{
							display: 'flex', alignItems: 'center', gap: 6,
							background: 'transparent', border: '1px solid #1e1e1e',
							color: 'var(--white-dim)', padding: '6px 14px', borderRadius: 2,
							fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
							fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
						}}
							onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c00'; (e.currentTarget as HTMLElement).style.color = '#ff4444'; }}
							onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)'; }}
						>
							<LogOut size={13} />
							<span className='hidden sm:inline'>Out</span>
						</button>
					) : (
						<div style={{ display: 'flex', gap: 10 }}>
							<Link to='/signup' style={{
								padding: '7px 16px', background: 'var(--gold)', color: '#000',
								borderRadius: 2, fontSize: '0.7rem', letterSpacing: '0.1em',
								textTransform: 'uppercase', fontWeight: 700,
								textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
								transition: 'all 0.2s',
							}}
								onMouseEnter={e => (e.currentTarget.style.background = '#e8c97a')}
								onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
							>
								<UserPlus size={13} />
								Join
							</Link>
							<Link to='/login' style={{
								padding: '7px 16px', background: 'transparent',
								border: '1px solid #1e1e1e', color: 'var(--white-dim)',
								borderRadius: 2, fontSize: '0.7rem', letterSpacing: '0.1em',
								textTransform: 'uppercase', fontWeight: 500,
								textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
								transition: 'all 0.2s',
							}}
								onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
								onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)'; }}
							>
								<LogIn size={13} />
								Login
							</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
