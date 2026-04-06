import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

const API_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

interface FormData { name: string; email: string; password: string; confirmPassword: string; }
interface ValidationErrors { name?: string; email?: string; password?: string; confirmPassword?: string; }

function validate(data: FormData): ValidationErrors {
	const errors: ValidationErrors = {};
	if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
	if (data.name.trim().length > 64) errors.name = 'Name must be at most 64 characters';
	if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Please enter a valid email address';
	if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
	else if (data.password.length > 128) errors.password = 'Password must be at most 128 characters';
	else if (!/[A-Z]/.test(data.password)) errors.password = 'Password needs at least one uppercase letter';
	else if (!/[0-9]/.test(data.password)) errors.password = 'Password needs at least one number';
	if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
	return errors;
}

const inputStyle = {
	width: '100%', padding: '12px 12px 12px 42px',
	background: '#0a0a0a', border: '1px solid #1e1e1e',
	color: '#f5f5f0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem',
	outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
};

const SignUpPage = () => {
	const [formData, setFormData] = useState<FormData>({ name: '', email: '', password: '', confirmPassword: '' });
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [focused, setFocused] = useState<string | null>(null);
	const { signup, loading } = useUserStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors = validate(formData);
		if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
		setErrors({});
		signup(formData);
	};

	const field = (key: keyof FormData) => ({
		value: formData[key],
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData({ ...formData, [key]: e.target.value });
			if (errors[key]) setErrors({ ...errors, [key]: undefined });
		},
	});

	const renderField = (key: keyof FormData, label: string, type: string, placeholder: string, icon: React.ReactNode, hint?: string) => (
		<div key={key} style={{ position: 'relative' }}>
			<label style={{ display: 'block', color: 'var(--white-muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
			<div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(30%)', color: focused === key ? 'var(--gold)' : '#333', transition: 'color 0.2s' }}>
				{icon}
			</div>
			<input type={type} required {...field(key)}
				onFocus={() => setFocused(key)} onBlur={() => setFocused(null)}
				style={{ ...inputStyle, borderColor: errors[key] ? '#c00' : focused === key ? 'var(--gold)' : '#1e1e1e' }}
				placeholder={placeholder}
			/>
			{errors[key] && <p style={{ color: '#ff4444', fontSize: '0.7rem', marginTop: 4 }}>{errors[key]}</p>}
			{!errors[key] && hint && <p style={{ color: 'var(--white-muted)', fontSize: '0.7rem', marginTop: 4 }}>{hint}</p>}
		</div>
	);

	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', background: '#000' }}>
			<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ width: '100%', maxWidth: 440 }}>

				<div style={{ textAlign: 'center', marginBottom: 40 }}>
					<div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, var(--gold))', margin: '0 auto 24px' }} />
					<p style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>Join the Club</p>
					<h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', fontWeight: 400, color: '#f5f5f0', margin: 0 }}>Create Account</h2>
				</div>

				<div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', padding: '36px' }}>

					{/* OAuth */}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
						{[
							{ href: `${API_URL}/auth/google`, label: 'Continue with Google', icon: (
								<svg style={{ width: 18, height: 18 }} viewBox='0 0 24 24'>
									<path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
									<path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
									<path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
									<path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
								</svg>
							)},
							{ href: `${API_URL}/auth/github`, label: 'Continue with GitHub', icon: (
								<svg style={{ width: 18, height: 18, fill: '#f5f5f0' }} viewBox='0 0 24 24'>
									<path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12'/>
								</svg>
							)},
						].map(({ href, label, icon }) => (
							<a key={href} href={href} style={{
								display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
								padding: '11px', border: '1px solid #1e1e1e', background: 'transparent',
								color: 'var(--white-dim)', textDecoration: 'none',
								fontSize: '0.8rem', letterSpacing: '0.04em', fontFamily: 'DM Sans, sans-serif',
								transition: 'all 0.2s',
							}}
								onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)'; (e.currentTarget as HTMLElement).style.color = '#f5f5f0'; }}
								onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.color = 'var(--white-dim)'; }}
							>
								{icon} {label}
							</a>
						))}
					</div>

					{/* Divider */}
					<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
						<div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
						<span style={{ color: 'var(--white-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
						<div style={{ flex: 1, height: 1, background: '#1e1e1e' }} />
					</div>

					<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						{renderField('name', 'Full Name', 'text', 'Ahmed Ayman', <User size={15} />)}
						{renderField('email', 'Email', 'email', 'you@example.com', <Mail size={15} />)}
						{renderField('password', 'Password', 'password', '••••••••', <Lock size={15} />, 'Min 8 chars, one uppercase, one number')}
						{renderField('confirmPassword', 'Confirm Password', 'password', '••••••••', <Lock size={15} />)}

						<button type='submit' disabled={loading} style={{
							marginTop: 8, padding: '13px', background: 'var(--gold)', color: '#000',
							border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
							fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
							fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
							opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
						}}
							onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#e8c97a'; }}
							onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
						>
							{loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} />Creating...</> : <><UserPlus size={15} />Create Account</>}
						</button>
					</form>

					<p style={{ marginTop: 24, textAlign: 'center', color: 'var(--white-muted)', fontSize: '0.8rem' }}>
						Already have an account?{' '}
						<Link to='/login' style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
							Sign in <ArrowRight style={{ display: 'inline', verticalAlign: 'middle' }} size={13} />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
