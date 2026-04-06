import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';

const API_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface ValidationErrors {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
}

function validate(data: FormData): ValidationErrors {
	const errors: ValidationErrors = {};

	if (data.name.trim().length < 2)  errors.name = 'Name must be at least 2 characters';
	if (data.name.trim().length > 64) errors.name = 'Name must be at most 64 characters';

	if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
		errors.email = 'Please enter a valid email address';

	if (data.password.length < 8)
		errors.password = 'Password must be at least 8 characters';
	else if (data.password.length > 128)
		errors.password = 'Password must be at most 128 characters';
	else if (!/[A-Z]/.test(data.password))
		errors.password = 'Password needs at least one uppercase letter';
	else if (!/[0-9]/.test(data.password))
		errors.password = 'Password needs at least one number';

	if (data.password !== data.confirmPassword)
		errors.confirmPassword = 'Passwords do not match';

	return errors;
}

const SignUpPage = () => {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState<ValidationErrors>({});
	const { signup, loading } = useUserStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const validationErrors = validate(formData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
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

	return (
		<div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<motion.div
				className='sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create your account</h2>
			</motion.div>

			<motion.div
				className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>

					{/* OAuth buttons */}
					<div className='space-y-3 mb-6'>
						<a
							href={`${API_URL}/auth/google`}
							className='w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-150'
						>
							<svg className='h-5 w-5' viewBox='0 0 24 24'>
								<path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/>
								<path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
								<path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/>
								<path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/>
							</svg>
							Continue with Google
						</a>

						<a
							href={`${API_URL}/auth/github`}
							className='w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition duration-150'
						>
							<svg className='h-5 w-5 fill-white' viewBox='0 0 24 24'>
								<path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12'/>
							</svg>
							Continue with GitHub
						</a>
					</div>

					{/* Divider */}
					<div className='relative mb-6'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-600' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='px-2 bg-gray-800 text-gray-400'>Or continue with email</span>
						</div>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6'>

						{/* Name */}
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>Full name</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='name' type='text' required
									{...field('name')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='Ahmed Ayman'
								/>
							</div>
							{errors.name && <p className='mt-1 text-xs text-red-400'>{errors.name}</p>}
						</div>

						{/* Email */}
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-300'>Email address</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email' type='email' required
									{...field('email')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='you@example.com'
								/>
							</div>
							{errors.email && <p className='mt-1 text-xs text-red-400'>{errors.email}</p>}
						</div>

						{/* Password */}
						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>Password</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password' type='password' required
									{...field('password')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='••••••••'
								/>
							</div>
							{errors.password
								? <p className='mt-1 text-xs text-red-400'>{errors.password}</p>
								: <p className='mt-1 text-xs text-gray-500'>Min 8 chars, one uppercase, one number</p>
							}
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>Confirm Password</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword' type='password' required
									{...field('confirmPassword')}
									className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'}`}
									placeholder='••••••••'
								/>
							</div>
							{errors.confirmPassword && <p className='mt-1 text-xs text-red-400'>{errors.confirmPassword}</p>}
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<><Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />Loading...</>
							) : (
								<><UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />Sign up</>
							)}
						</button>
					</form>

					<p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{' '}
						<Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
							Login here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
